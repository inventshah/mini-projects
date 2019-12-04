from lexer import lex
from parser import parse
from eval import eval_list
from env import Env
from stdlib import load_lib

def get_chars(filename):
	with open(filename, 'r') as file:
		c = ' '
		while c != '':
			c = file.read(1)
			yield c

def run(filename):
	env = Env(None)
	load_lib(env)
	eval_list(parse(lex(get_chars(filename))), env)
