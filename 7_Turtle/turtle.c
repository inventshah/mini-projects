// Sachin
// Painting Turtle in OpenGL
// Press the Space Bar to enter a new command
// Commands:
//   MOV  -- Let the turtle move
//   ROT  -- Rotate the turtle's movement
//   LEN  -- Change the turtle's brush size
//   RGB  -- Change the paint color
//   END  -- End the program
//
// 'q' or 'Q' to quit
// gcc turtle.c -framework GLUT -framework OpenGL -lreadline && ./a.out

#include "turtle.h"

#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <GLUT/glut.h>
#include <OpenGL/gl.h>
#include <OpenGL/glu.h>
#include <readline/readline.h>

painter_t *main_painter;
painter_t *current_painter;

int speed = 0;
float angle = 0;

float hex_to_color(unsigned int c, int shift)
{
	return ((c >> shift) & 0xff) / 255.0;
}

unsigned int get_color(void)
{
	unsigned int color;

	printf("Enter color in hex: ");
	scanf("%x", &color);

	return color;
}

int get_int(char *msg)
{
	int n;
	printf("%s", msg);
	scanf("%d", &n);
	return n;
}

void get_command(painter_t *painter)
{
	int temp;
	char *buffer = readline("> ");

	if(!strcmp(buffer, "MOV"))
	{
		speed = 1;
	}
	else if(!strcmp(buffer, "END"))
	{
		destroy_painters();
		exit(0);
	}
	else if(!strcmp(buffer, "ROT"))
	{
		temp = get_int("Enter degrees: ");

		angle += temp * M_PI / 180.0;
	}
	else if(!strcmp(buffer, "RGB"))
	{
		painter->color = get_color();
	}
	else if(!strcmp(buffer, "LEN"))
	{
		painter->brush_size = (short) get_int("Enter size: ");
	}
	else
	{
		printf("Unknown command: %s.\n", buffer);
		get_command(painter);
	}
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

void changeSize(int w, int h)
{
	// Do nothing
}

void destroy_painters(void)
{
	painter_t *temp = current_painter;
	painter_t *curr = current_painter;
	while(curr != NULL)
	{
		temp = curr->before;
		free(curr);
		curr = temp;
	}
}

// Keyboard input logic
void release_key(int key, int x, int y) 
{
	if(key == 32) // Enter new command, 'space bar'
	{
		get_command(current_painter);
	}
	else if(key == 113 || key == 81) // Quit condition, 'q', 'Q'
	{
		destroy_painters();
		exit(0);
	}
}

void paint_turtle(painter_t *painter)
{
	// Update x, y position
	float dx = speed * cos(angle) * DELTA_TIME;
	float dy = speed * sin(angle) * DELTA_TIME;

	if(dx || dy)
	{
		painter_t *next = malloc(sizeof(painter_t));
		*next = *current_painter;
		next->next = NULL;
		next->before = current_painter;

		next->x += dx;
		next->y += dy;

		current_painter->next = next;
		current_painter = next;
	}

	painter_t *curr = painter;
	int i = 0;
	while(curr != NULL)
	{
		glColor3f(
			hex_to_color(curr->color, RED_SHIFT),
			hex_to_color(curr->color, GREEN_SHIFT),
			hex_to_color(curr->color, BLUE_SHIFT));
		draw_circle(curr->x, curr->y, curr->brush_size);
		curr = curr->before;
		i++;
	}
}

// Render the screen
void render()
{
	glClearColor(0.0, 0.0, 0.0, 1.0);
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	glLoadIdentity();

	paint_turtle(current_painter);

	glutSwapBuffers();
}

void idle()
{
	glutPostRedisplay();
}

int main(int argc, char *argv[])
{
	main_painter = malloc(sizeof(painter_t));
	*main_painter = (painter_t) {WIDTH/2, HEIGHT/2, 0x11ffaa, 5, NULL, NULL};
	current_painter = main_painter;

	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_DEPTH | GLUT_RGBA | GLUT_DOUBLE);
	glutInitWindowSize(WIDTH, HEIGHT);
	glutInitWindowPosition(100, 100);
	glutCreateWindow("Turtle");

	glutDisplayFunc(render);
	glutReshapeFunc(changeSize);
	glutSpecialUpFunc(release_key);

	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();

	glViewport(0, 0, WIDTH, HEIGHT);
	gluOrtho2D(0, WIDTH, 0, HEIGHT); 

	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();

	glutIdleFunc(idle);

	glEnable(GL_DEPTH_TEST);

	glutMainLoop();
}
