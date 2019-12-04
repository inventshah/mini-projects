import re
from error_handler import eof, line, unexpected_token
from stream import Stream
from string import ascii_letters, digits

whitespace = ' \t\n'
operation = '+-*/%&|=<>'
string = ['"', "'"]
special = '[]{}(),;:'
symchars = ascii_letters + digits + "_"
comment = '#'

def get_generic(first, stream, allowed):
	ret = first
	c = stream.next
	while stream.next is not None and stream.next in allowed:
		ret += stream.get()
	return ret

def get_num(first_digit, stream):
	return get_generic(first_digit, stream, digits + '.')

def get_symbol(first_char, stream):
	return get_generic(first_char, stream, symchars)

def get_string(delimiter, stream):
	ret = ""
	while stream.next != delimiter:
		c = stream.get()
		if c is None:
			eof(delimiter)
			break;
			# raise Exception("Missing %s for end of string" %delimiter)
		ret += c
	# Consume the last quote
	stream.get()
	return ret

def pass_comment(stream):
	while stream.next is not None and stream.next not in (comment + '\n'):
		stream.get()
	# Consume the comment delimiter, whether it be # or a newline
	stream.get()

def lex(chars):
	stream = Stream(chars)
	ret = []
	while stream.next is not None:
		c = stream.get()
		if c in whitespace:
			if c == '\n':
				line()
			pass
		elif c in operation:
			ret.append(('operation', c))
		elif c in string:
			ret.append(('string', get_string(c, stream)))
		elif c in digits:
			ret.append(('number', get_num(c, stream)))
		elif c in symchars:
			ret.append(('symbol', get_symbol(c, stream)))
		elif c in special:
			ret.append((c, ''))
		elif c in comment:
			pass_comment(stream)
		else:
			unexpected_token(c)
			#raise Exception('Unexpected character: >>%s<<' %c)
	return ret