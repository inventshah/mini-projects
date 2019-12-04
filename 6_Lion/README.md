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

#### Variable assignment:
Variables can be assigned with a colon, and must start with a letter or an underscore. Variable names can only include alphanumeric characters or an underscore. Valid assignments:

```
a : 1;
_abc : 2;
sum : a + _abc;
name : 'Lion';
n : a = _abc;
```
Attempting to call a variable that hasn't been assigned will throw an error. Variables can be assigned and reassigned to anything excepted a raw negative value such as -1, use neg(number) to get a negative value instead: `a : neg(1)`.

#### Functions:
Every function returns the last line executed within the block.

Native:

- print(statement) - prints the statement to stdin 
- if(boolean, true code, false code) - conditional logic
- loop(number of iterations, code to execute every iteration) - repeat actions
- neg(number) - negate a number, neg(1) -> -1, neg(-1) -> 1
- str(variable) - convert the variable to type String
- quit() - to end the program

Function declaration:

```
foo : (parameter list here){
	your code here
};
```
These functions create a new namespace such that it can read from the global namespace, but can only write to the local one.

Global functions allow to write to global variables. Here's the declaration:

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

### Built With:
- Python 3