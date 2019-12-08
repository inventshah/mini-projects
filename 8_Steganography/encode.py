#!/usr/bin/env python3

# Sachin
# Image Steganography
# ./encode.py filename.png

import sys
from PIL import Image

# Convert the message to a binary string and terminate it with a '\'
def msg_to_bin(msg):
	ret = []
	for c in msg:
		bits = bin(ord(c))[2:]
		bits = '0'*(7-len(bits)) + bits
		ret.append(bits)
	ret.append(bin(92)[2:]);
	return ''.join(ret)

# Ask for the message, and convert it. Add bits at the end if the message is short 
def get_msg():
	print("What would you like to encode?")
	msg = msg_to_bin(input())
	return msg + ('0'*(len(msg) % 3))

# Set the end bit of an RGB value
def set_val(val, char):
	return (val | 1) ^ 1 if char == '0' else (val | 1)

# main encoder
def encode(msg, pix, width):
	print("Encoding message...")
	i = 0
	while(i < len(msg)-2):
		x = (i / 3) / width
		y = (i / 3) % width
		red, green, blue = pix[x,y]

		red = set_val(red, msg[i])
		green = set_val(green, msg[i+1])
		blue = set_val(blue, msg[i+2])

		pix[x,y] = (red, green, blue)
		i+=3
	return pix

if __name__ == "__main__":
	if(len(sys.argv) < 2):
		print("Please supply an image")
		quit()
	im = Image.open(sys.argv[1])
	pix = im.load()
	msg = get_msg()
	encode(msg, pix, im.size[0])
	im.save('e'+sys.argv[1])
	print("...Finished encoding")