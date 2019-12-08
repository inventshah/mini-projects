#!/usr/bin/env python3

# Sachin
# Image Steganography
# ./decode.py filename.png

import sys
from PIL import Image

# Save the message to a textfile
def save(msg):
	with open("decoded.txt", 'w') as file:
		file.write(msg)

# main decoder
def decode(pix, size):
	print("Decoding image...")
	ret = []
	for i in range(size[0]):
		for j in range(size[1]):
			red, green, blue = pix[i,j]
			red = red & 1
			green = green & 1
			blue = blue & 1
			ret.append(str(red))
			ret.append(str(green))
			ret.append(str(blue))

	ret = ''.join(ret)

	n = 7
	chars = [ret[i:i+n] for i in range(0, len(ret), n)]
	ret = ''
	for c in chars:
		out = 0
		for bit in c:
			out = (out << 1) | int(bit)
		if out == 92:
			break
		ret += chr(out)

	save(ret)
	print("...Finished decoding")

if __name__ == "__main__":
	if(len(sys.argv) < 2):
		print("Please supply an image")
		quit()
	im = Image.open(sys.argv[1])
	pix = im.load()
	decode(pix, im.size)