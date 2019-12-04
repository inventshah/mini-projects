from stream import Stream
from error_handler import none, eof, expected

EOL = ';'
class Parser:
	def __init__(self, tokens, end):
		self.tokens = tokens
		self.end = end

	def get_expression(self, prev):
		if self.error(self.end):
			return none

		key, value = self.tokens.next
		if key in self.end:
			return prev
		self.tokens.get()
		if key in ['number', 'string', 'symbol']:
			return self.get_expression((key, value))
		elif key == 'operation':
			second_arg = self.get_expression(None)
			return self.get_expression(("operation", value, prev, second_arg))
		elif key == '(':
			args = self.expression_list_from_next(')', ',')
			if prev is None:
				func_body = self.expression_list(';', '}')
				return self.get_expression(("function", args or [], func_body))
			else:
				return self.get_expression(("call", prev, args))
		elif key == ':':
			if prev is None:
				expected('nothing', 'variable')
				return none
			if prev[0] != 'symbol':
				expected(prev[0], 'variable')
				return none
			second_arg = self.get_expression(None)
			return self.get_expression(("assignment", prev, second_arg))
		elif key == "{":
			func_body = self.expression_list_from_next('}', ';')
			return self.get_expression(("global function", func_body))
		else:
			return none

	def expression_list_from_next(self, end, seperation):
		ret = []
		if self.error(end):
			return ret

		(key, value) = self.tokens.next

		if key != end:
			list_parser = Parser(self.tokens, [seperation, end])
			while key != end:
				exp = list_parser.get_expression(None)
				if exp is not None:
					ret.append(exp)
				(key, value) = self.tokens.get()
				if self.error(end):
					break
		else:
			self.tokens.get()
		return ret

	def expression_list(self, seperation, end):
		ret = []
		if self.error(end):
			return ret

		(key, value) = self.tokens.next

		self.tokens.get()
		if key != end:
			list_parser = Parser(self.tokens, [seperation, end])
			while key != end:
				exp = list_parser.get_expression(None)
				if exp is not None:
					ret.append(exp)
				(key, value) = self.tokens.next
				self.tokens.get()
				if self.error(end):
					break
		return ret

	def error(self, looking_for):
		if self.tokens.next is None:
			eof(looking_for)
			return True
		return False

def parse(tokens):
	parser = Parser(Stream(tokens), EOL)
	ret = []
	while parser.tokens.next is not None:
		exp = parser.get_expression(None)
		if exp is not None:
			ret.append(exp)
		parser.tokens.get()
	return ret