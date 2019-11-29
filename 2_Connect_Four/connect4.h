#ifndef __CONNECT4_H
#define __CONNECT4_H

// Drawing and Rendering Methods
void draw_circle(float x, float y, float radius);
void draw_line(float x1, float y1, float x2, float y2);

void p1color();
void p2color();

void draw_piece(int x, int y);
void draw_current_piece(int x);

void draw_grid();
void draw_board();

float get_x(int x);
float get_y(int y);

void draw_win(int winner);

// Moves
void place();
void bot();

// OpenGL Helper Methods
void changeSize(int w, int h);
void release_key(int key, int x, int y);

void render();
void idle();

// Game Logic
void count(int i, int j, int *p1count, int *p2count);
int check_win();
void reset_board();

#endif