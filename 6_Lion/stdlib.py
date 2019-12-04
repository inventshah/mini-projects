from eval import eval_expression

def token_str(token):
	if type(token) != tuple:
		return str(token)
	(key, v) = token
	if key == 'number':
		return str(v)
	if key == 'string':
		return str(v)
	if key == 'function':
		return '<function>'
	if key == 'native':
		return '<native>'
	if key == 'none':
		return 'none'
	if key == 'symbol':
		return '<%s | symbol>'%str(v)
	return '<null>'

def std_quit(env):
	quit()

def std_if(b, event1, event2, env):
	event = event1 if b[1] == 'True' else event2
	return eval_expression(event, env)

def std_print(string, env):
	ret = eval_expression(string, env)
	print(token_str(ret))

def std_loop(num, action, env):
	ret = []
	for i in range(int(num[1])):
		ret = eval_expression(action, env)
	return ret

def std_neg(expr, env):
	num = eval_expression(expr, env)
	return ('number', -num[1])

def std_str(token, env):
	return ('string', token_str(token))

def load_lib(env):
	env.set("quit", ("native", std_quit))
	env.set("print", ("native", std_print))
	env.set("if", ("native", std_if))
	env.set("loop", ("native", std_loop))
	env.set("neg", ("native", std_neg))
	env.set("str", ("native", std_str))