# Image Steganography
An image message encoder. Modifies pixel least significant bits to hide a secret message.

### How to Use:
Download the 8\_Steganography folder. Install the Pillow dependency used to manipulate images. `pip install Pillow`

Encode: `./encode image_filename`

`image_filename` should the base image to encode the message into. The program will prompt for a message and save the encoded image as the image_filename starting with an 'e'.

- Decode: `./decode image_filename`
`image_filename` should the encoded image. The program will save the decoded message as `decoded.txt`.

### Encoding:
The encoder converts the message to binary and saves it to the image's least significant bits. Each pixel's red, green, and blue components last bit maps to a bit in the message. You can encode at max `3 * width * height / 7` characters into an image.

### Example:
```
./encode test.png
What would you like to encode?
hello world
Encoding message...
...Finished encoding

./decode etest.png
Decoding image...
...Finished decoding

cat decoded.txt
hello world
```

### Built With:
- Python 3