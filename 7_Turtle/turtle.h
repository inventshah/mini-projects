#ifndef __TURTLE_H
#define __TURTLE_H

#define GL_SILENCE_DEPRECATION

#define RED_SHIFT   16
#define GREEN_SHIFT 8
#define BLUE_SHIFT  0

#define WIDTH       1024
#define HEIGHT      768

#define DELTA_TIME  0.1

typedef struct painter
{
	float x;
	float y;

	int color;

	short brush_size;
	struct painter *next;
	struct painter *before;
} painter_t;

// User input methods
float hex_to_color(unsigned int c, int shift);
unsigned int get_color(void);
int get_int(char *msg);
void get_command(painter_t *painter);

// Drawing a circle as n-polygon
void draw_circle(float x, float y, float radius);

// Clean up malloc
void destroy_painters(void);

// Keyboard input logic
void release_key(int key, int x, int y);

void paint_turtle(painter_t *painter);

// OpenGL needed methods
void render();
void idle();
void changeSize(int w, int h);

#endif