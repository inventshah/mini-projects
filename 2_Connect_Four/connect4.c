// Sachin
// Connect 4 in OpenGL
// Left/Right arrow keys + space for player move
// 'b' for an automated move
// After win space to reset board
// 'q' to quit
// gcc connect4.c -framework GLUT -framework OpenGL && ./a.out

#define GL_SILENCE_DEPRECATION

#include "connect4.h"

#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h> 

#include <GLUT/glut.h>
#include <OpenGL/gl.h>
#include <OpenGL/glu.h>

// Window Dimensions
float width = 500;
float height = 500;

// Board rendering variables
float board_width = 10;
float vert_width;
float horiz_height;

// Data structure to keep board state
char board[6][7];
int highest[7];

// Player markers
char player1 = 'X';
char player2 = 'O';
char current_player = 1;

// Location of the piece to place
int location = 3;
int last_location = 3;

// Win conditions
float points[4][2];
int win = 0;

// Clears board for a new games
void reset_board()
{
	int i, j;
	for (i = 0; i < 6; i++)
	{
		for (j = 0; j < 7; j++)
		{
			board[i][j] = '_';
		}
		highest[i] = 0;
	}

	highest[6] = 0;
}

// Drawing a circle as n-polygon
void draw_circle(float x, float y, float radius)
{
	int resolution = 60, i;
	float theta, cx, cy;

	glBegin(GL_POLYGON);

    for(i = 0; i < resolution; i++)
    {
        theta = 2.0 * M_PI * i / resolution;

        cx = radius * cos(theta);
        cy = radius * sin(theta);

        glVertex2f(x + cx, y + cy);
    }

    glEnd();
}

// Draw a line from (x1, y1) --> (x2, y2)
void draw_line(float x1, float y1, float x2, float y2)
{
	int i;

	glBegin(GL_LINE_STRIP);

	glVertex2f(x1, y1);
	glVertex2f(x2, y2);

	glEnd();
}

// Convert an array index to an x location
float get_x(int x)
{
	return vert_width * (x + 0.5) + board_width / 2.0;
}

// Convert an array index to an y location
float get_y(int y)
{
	return horiz_height * (y + 0.5) + board_width / 2.0;
}

// Draw an arbitrary piece on an x, y integer grid as a circle
void draw_piece(int x, int y)
{
	glLineWidth(1);
	draw_circle(get_x(x), get_y(y), width / 17);
}

// Draw a piece above the grid
void draw_current_piece(int x)
{
	draw_piece(x, 6);
}

// Player 1's color
void p1color()
{
	glColor3f(0.8, 0, 0);
}

// Player 2's color
void p2color()
{
	glColor3f(0.8, 0.7, 0);
}

// Draw a line connecting the winning pieces
void draw_win(int winner)
{
	int i;

	glLineWidth(board_width);
	glColor3f(0.2, 0.2, 0.2);

	glBegin(GL_LINE_STRIP);

	for (i = 0; i < 4; i++)
	{
		glVertex2f(get_x(points[i][0]), get_y(points[i][1]));
	}

	glEnd();

	winner ? p1color() : p2color();

	for (i = 0; i < 7; i++)
	{
		draw_piece(i, 6);
	}
}

// Draw the Connect 4 grid, 6 rows and 7 columns
void draw_grid()
{
	int i;
	float x, y;

	glLineWidth(board_width);
	glColor3f(0, 0, 0);

	for (i = 0; i <= 7; i++)
	{
		x = i * vert_width + board_width / 2.0;
		draw_line(x, 0, x, height - horiz_height);

		if (i != 7)
		{
			y = i * horiz_height + board_width / 2.0;
			draw_line(0, y, width, y);
		}
	}
}

// Draw the pieces that have been played
void draw_board()
{
	int i, j;
	for (i = 0; i < 6; i++)
	{
		for (j = 0; j < 7; j++)
		{
			if (board[i][j] == player1)
			{
				p1color();
				draw_piece(j, i);
			}
			else if (board[i][j] == player2)
			{
				p2color();
				draw_piece(j, i);
			}
		}
	}
}

// Place the current piece to the top of the column stack
void place()
{
	if (highest[location] > 5)
	{
		return;
	}
	board[highest[location]][location] = current_player ? 'X' : 'O';
	highest[location]++;

	current_player = !current_player;

	last_location = location;
}

// Take a bot move, a random location near the last played location 
void bot()
{
	int rand_num = rand() % 3;

	if (last_location == 0)
	{
		last_location++;
	}
	else if (last_location == 6)
	{
		last_location--;
	}

	location = last_location;

	if (rand_num == 0)
	{
		location--;
	}
	else if (rand_num == 1)
	{
		location++;
	}
	place();
}

void changeSize(int w, int h)
{
	// Do nothing
}

// Keyboard input logic
void release_key(int key, int x, int y) 
{
	switch (key)
	{
		case GLUT_KEY_LEFT:
			if (location > 0)
			{
				location--;
			}
			break;
		case GLUT_KEY_RIGHT:
			if (location < 6)
			{
				location++;
			}
			break;
		// Space key: reset if win, else play a piece
		case 32:
			if (win)
			{
				reset_board();
				win = 0;
				current_player = 1;
				location = 3;
			}
			else
			{
				place();
			}
			break;
		// 'b' and 'B': take a bot move
		case 98:
		case 66:
			bot();
			break;
		// 'q' and 'Q': end the program
		case 113:
		case 81:
			exit(0);
			break;

	}
}

// Update the counts based on the (i, j) element of the board
// Record the winning pieces
void count(int i, int j, int *p1count, int *p2count)
{
	if (board[i][j] == player1)
	{
		points[*p1count][0] = j;
		points[*p1count][1] = i;
		(*p1count)++;
		*p2count = 0;
	}
	else if (board[i][j] == player2)
	{
		points[*p2count][0] = j;
		points[*p2count][1] = i;
		*p1count = 0;
		(*p2count)++;
	}
	else
	{
		*p1count = 0;
		*p2count = 0;
	}
}

// Check if there is a winning condition
int check_win()
{
	int i, j;
	int x, y;

	int p1count;
	int p2count;

	// Horizontal wins
	for (i = 0, p1count = 0, p2count = 0; i < 6; i++)
	{
		for (j = 0; j < 7; j++)
		{
			count(i, j, &p1count, &p2count);

			if (p1count == 4)
			{
				return 1;
			}
			else if (p2count == 4)
			{
				return -1;
			}
		}
	}

	// Vertical wins
	for (j = 0; j < 7; j++)
	{
		for (i = 0, p1count = 0, p2count = 0; i < 6; i++)
		{
			count(i, j, &p1count, &p2count);

			if (p1count == 4)
			{
				return 1;
			}
			else if (p2count == 4)
			{
				return -1;
			}
		}
	}

	//Diagonal
	for (j = 0; j < 7; j++)
	{
		for (i = 0; i < 6; i++)
		{
			for (x = i, y = j, p1count = 0, p2count = 0; x < 6 && y < 7; x++, y++)
			{
				count(x, y, &p1count, &p2count);

				if (p1count == 4)
				{
					return 1;
				}
				else if (p2count == 4)
				{
					return -1;
				}
			}

			for (x = i, y = j, p1count = 0, p2count = 0; x >= 0 && y < 7; x--, y++)
			{
				count(x, y, &p1count, &p2count);

				if (p1count == 4)
				{
					return 1;
				}
				else if (p2count == 4)
				{
					return -1;
				}
			}
		}
	}

	return 0;
}

// Render the screen
void render()
{
	glClearColor(0.0, 0.7, 1.0, 1.0);
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	glLoadIdentity();

	win = check_win();

	if (win)
	{
		if (win < 0)
		{
			current_player = 0;
		}
		else if (win > 0)
		{
			current_player = 1;
		}

		draw_win(current_player);
	}

	draw_grid();

	current_player ? p1color() : p2color();
	draw_current_piece(location);

	draw_board();


	glutSwapBuffers();
}

void idle()
{
	glutPostRedisplay();
}

int main(int argc, char *argv[])
{
	srand(time(0));
	vert_width = (width - board_width) / 7.0;
	horiz_height = (height - board_width) / 7.0;

	reset_board();

	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_DEPTH | GLUT_RGBA | GLUT_DOUBLE);
	glutInitWindowSize(width, height);
	glutInitWindowPosition(100, 100);
	glutCreateWindow("Connect4");

	glutDisplayFunc(render);
	glutReshapeFunc(changeSize);
	glutSpecialUpFunc(release_key);

	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();

	glViewport(0, 0, width, height);
	gluOrtho2D(0, width, 0, height); 

	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();

	glutIdleFunc(idle);

	glEnable(GL_DEPTH_TEST);

	glutMainLoop();
}

