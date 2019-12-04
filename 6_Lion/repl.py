#!/usr/bin/env python3

from lexer import lex
from parser import parse
from eval import eval_list
from env import Env
from stdlib import load_lib

def token_str(token):
	if type(token) != tuple:
		return token
	(key, *v) = token
	if key == 'number':
		return "<%s | Number>"%str(v[0])
	if key == 'string':
		return '<%s | String>'%repr(v[0])
	if key == 'function':
		return '<function>'
	if key == 'global function':
		return '<global function>'
	if key == 'native':
		return '<native>'
	if key == 'none':
		return 'none'
	if key == 'symbol':
		return '<%s | symbol>'%str(v[0])
	return '<null>'

def new_line():
	print('***', end = ' ')

def repl():
	print('Lion Programming')
	new_line()
	env = Env(None)
	load_lib(env)
	line = ''
	results = None
	while True:
		line = input()
		if len(line) != 0:
			if line[-1] != ';':
				line += ';'
			results = eval_list(parse(lex(line)), env)
		if results is not None:
			print(token_str(results))
		new_line()

if __name__ == "__main__":
	repl()