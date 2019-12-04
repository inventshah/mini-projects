import sys
none = ('none', None)

line_count = 1

def line():
	try:
		line_count += 1
	except:
		line_count = 1

def eprint(err):
	print('Error: %s' % err, file=sys.stderr)

def unexpected_token(token):
	eprint('Unexpected token "%s" on line %d' % (token, line_count))

def eof(token):
	eprint('Expected %s but reached end of file' % token)

def expected(token, needed):
	eprint('Expected %s but found %s' % (needed, token))

def type_mismatch(t1, t2):
	eprint('Type mismatch, recieved %s and %s' % (t1, t2))

def unknown(symbol):
	eprint('Unknown symbol "%s"' % symbol)

def parameter_warning(token, needed):
	print('Warning: Expected %d arguments but found %d arguments' % (needed, token), file=sys.stderr)
