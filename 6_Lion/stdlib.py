from eval import eval_expression, eval_list
from lexer import lex
from parser import parse
from error_handler import none

def token_str(token):
	if type(token) != tuple:
		return str(token)
	(key, *v) = token
	if key == 'number':
		return str(v[0])
	if key == 'string':
		return str(v[0])
	if key == 'function':
		return '<function>'
	if key == 'native':
		return '<native>'
	if key == 'global function':
		return '<global function>'
	if key == 'none':
		return 'none'
	if key == 'symbol':
		return '<%s | symbol>'%str(v)
	return '<null>'

def std_quit(env):
	quit()

def std_if(b, event1, event2, env):
	cond = eval_expression(b, env)
	event = event1 if cond[1] == 'True' else event2
	return eval_expression(event, env)

def std_print(string, env):
	ret = eval_expression(string, env)
	print(token_str(ret))
	return none

def std_str(token, env):
	if token[0] == 'call':
		token = eval_expression(token, env)
	return ('string', token_str(token))

def std_eval(string, env):
	if string[0] != 'string':
		return none;
	return eval_list(parse(lex(string[1])), env)

def std_ask(string, env):
	std_print(string, env)
	return ('string', input())

def add_native(expr, env):
	return eval_list(parse(lex(expr)), env)

def load_lib(env):
	env.set("quit", ("native", std_quit))
	env.set("print", ("native", std_print))
	env.set("if", ("native", std_if))
	env.set("str", ("native", std_str))
	env.set("eval", ("native", std_eval))
	env.set("ask", ("native", std_ask))
	env.set("none", none)
	env.set("concat", add_native('(a,b){str(a)+str(b);};', env))
	env.set("while", add_native('(a,b){b();if(a(),while(a,b),{});};', env))
	env.set("loop", add_native('(a,b){eval(a*b);};', env))
