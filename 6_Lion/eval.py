from error_handler import none, unknown, expected, type_mismatch, parameter_warning, eprint
from env import Env

nums_only = '-*/&|'

def isnum(arg):
	return type(arg) == float

def operation(expr, env):
	arg1 = eval_expression(expr[2], env)
	arg2 = eval_expression(expr[3], env)
	operator = expr[1]
	if operator in nums_only:
		if isnum(arg1[1]) and isnum(arg2[1]):
			return ('number', eval(' %f %s %f' % (arg1[1], operator, arg2[1])))
		else:
			expected(arg1[0] if type(arg1[1]) != float else arg2[0], 'number')
	elif operator == '+':
		if type(arg1[1]) != type(arg2[1]):
			type_mismatch(arg1[0], arg2[0])
		else:
			return (arg1[0], arg1[1] + arg2[1])
	elif operator == '=':
		return ('string', str(arg1[1] == arg2[1]))
	elif operator in '<>':
		if type(arg1[1]) == type(arg2[1]):
			return ('string', str(eval('"%s" %s "%s"' % (str(arg1[1]), operator, str(arg2[1])))))
		type_mismatch(arg1[0], arg2[0])
	else:
		unknown(expr[1])

def call(expr, env):
	evaled_expr = eval_expression(expr[1], env)
	args = list((eval_arguments(arg, env) for arg in expr[2]))

	if evaled_expr[0] == 'function':
		(kind, parameters_need, body, func_env) = evaled_expr
		if (len(parameters_need) != len(args)):
			parameter_warning(len(args), len(parameters_need))
		new_env = Env(func_env)
		for param, arg in zip(parameters_need, args):
			new_env.set(param[1], arg)
		return eval_list(body, new_env)
	elif evaled_expr[0] == 'global function':
		(kind, body, func_env) = evaled_expr
		if len(args) != 0:
			parameter_warning(len(args), 0)
		return eval_list(body, func_env)
	elif evaled_expr[0] == 'native':
		return evaled_expr[1](*args, env)
	else:
		eprint('Attempted to call something that is not a function')
	return

def eval_arguments(expr, env):
	key, *value = expr
	if key == 'number':
		return ('number', float(value[0]))
	elif key == 'string':
		return ('string', value[0])
	elif key == 'none':
		return none
	elif key == 'symbol':
		ret = env.get(value[0])
		if ret is None:
			unknown(value[0])
			return none
		else:
			return ret
	elif key == 'assignment':
		arg = eval_expression(value[1], env)
		env.set(value[0][1], arg)
		return arg
	elif key == 'operation':
		return operation(expr, env)
	elif key == 'function':
		return ('function', expr[1], expr[2], Env(env))
	elif key == 'global function':
		return ('global function', expr[1], env)
	elif key == 'call':
		return expr

def eval_expression(expr, env):
	key, *value = expr
	if key == 'number':
		return ('number', float(value[0]))
	elif key == 'string':
		return ('string', value[0])
	elif key == 'none':
		return none
	elif key == 'symbol':
		ret = env.get(value[0])

		if ret is None:
			unknown(value[0])
			return none
		else:
			return ret
	elif key == 'assignment':
		arg = eval_expression(value[1], env)
		env.set(value[0][1], arg)
		return arg
	elif key == 'operation':
		return operation(expr, env)
	elif key == 'function':
		return ("function", expr[1], expr[2], Env(env))
	elif key == 'global function':
		return ('global function', expr[1], env)
	elif key == 'call':
		return call(expr, env)
	return none

def eval_list(expr_list, env):
	ret = none
	for expr in expr_list:
		ret = eval_expression(expr, env)
	return ret