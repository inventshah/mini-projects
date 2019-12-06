# Lion Programming Language
A custom interpreted programming language. Wrote a lexer, parser, and evaluator to execute Lion programs.

### How to Use:
Download the 6\_Lion folder.

- Open repl enviroment: `./lion`
- Execute a file `./lion filename`

### Synatx:
#### Data Types:
- Number: any float
- String: any character squence wrapped in single or double quotes
- Function: Standard 
- Global Function: has no local variables
- Native: functions that are internally declared
- Boolean: just strings where 'True' is true and anything else is false
- none: an empty object

#### Operations:
All operations are computed right to left. For example, 3 * 4 + 1 would return 15. Valid operators are:

- Addition: +
- Subtraction: -
- Division: /
- Multiplication: *
- Mod: %
- Bitwise Or: |
- Bitwise And: &
- Equality: =
- Less than: <
- Greater than: >
- Type Comparison: ~

Examples of type comparison:

```
x : 1;
y : 2;
z : x ~ y;   # z = True because x and y are both numbers
x : 'hello';
z : x ~ y;   # z = False because x is a string, but y is a number

# If there is only 1 argument next to ~ then,
p : x~       # p = False because x is not none
q = ~x       # q = 'number' because x's type is a number
```

#### Variable assignment:
Variables can be assigned with a colon, and must start with a letter or an underscore. Variable names can only include alphanumeric characters or an underscore. Valid assignments:

```
a : 1;            # a stores the number 1
_abc : 2;         # _abc stores the number 2
sum : a + _abc;   # sum stores the number 3, because a + _abc = 3
name : 'Lion';    # name stores the string 'Lion'
n : a = _abc;     # n stores the string 'False' because 1 does not equal 2
```
Attempting to call a variable that hasn't been assigned will throw an error. Variables can be assigned and reassigned to anything.

#### Functions:
Every function returns the result of the last line executed within the block.

Native Functions:

- print(statement) - prints the statement to stdin 
- if(boolean, true function call, false function call) - conditional logic
- str(variable) - convert the variable to type String
- quit() - to end the program
- eval(string) - evaluates a code string, and returns the last result
- ask(string) - requests input from the user and returns a string

Built-In Functions:

- concat(var1, var2) - create a new String of var1 + var2
- loop(number of iterations, string of code to repeat) - repeat actions
- while(condition function, repeated function) - while looping

Function declaration:

```
foo : (parameter list here){
	your code here
};
```
These functions create a new namespace such that it can read from the global namespace, but can only write to the local one.

Global functions have write access to their parent's namespace, usually global variables. Here's the declaration:

```
global_foo : {
	your code here
};
```
Notice the only change is that global functions do not have a parameter list. They only have global variables.

Use parentheses to call a function, like this `print('hi')`, `foo()` or `global_foo()`.

#### Comments:
Start all comments with '#' and end with a newline or another '#'

### Examples:
See `example.lion` for examples of functions and variables in Lion.

Functions:

```
math : (n, m){
	sum : n + m;
	sum * sum;
};
```
Calling `math(1, 2)` will return 9 because, the last line executes 3 * 3.

```
num_books : 0;
iterate : {
	num_books : num_books + 1;
};

create_book : (title, author){
	iterate(); # provides ability to modify num_books
	msg : concat(title, ' by ');
	concat(msg, author);
};
```
Every time `create_book` is called, `num_books` is iterated by one and returns a message in form 'Title by Author'.

### Built With:
- Python 3