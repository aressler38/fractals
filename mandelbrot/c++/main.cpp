/** \mainpage
 *
 */

#include "mandelbrot.h"
#include <iostream>
#include <png.h>
#include <string.h>
#include <stdio.h>
#include <ctime>

#define FRACTAL_FILE "fractal.png"



/**
 * Palette function
 */
void setRGB(png_byte *ptr, mandelbrot::img_datum data) {

  int v = (int)(data.area * 767);
  if (v > 767) v = 767;
  int offset = v % 256;


  if (data.iter == mandelbrot::MAX_ITER ) {
    ptr[0] = 0;
    ptr[1] = 0;
    ptr[2] = 0;
  } else if (data.iter < 1 ) {
    ptr[0] = 255;
    ptr[1] = 0;
    ptr[2] = 0;
  } else if (data.iter < 2 ) {
    ptr[0] = 0;
    ptr[1] = 122;
    ptr[2] = 0;
  } else if (data.iter < 4 ) {
    ptr[0] = 255;
    ptr[1] = 255;
    ptr[2] = 0;
  } else if (data.iter < 8 ) {
    ptr[0] = 120;
    ptr[1] = 205;
    ptr[2] = 0;
  } else if (data.iter < 8 ) {
    ptr[0] = 0;
    ptr[1] = 255;
    ptr[2] = 0;
  } else if (data.iter < 16 ) {
    ptr[0] = 0;
    ptr[1] = 0;
    ptr[2] = 255;
  } else if (data.iter < 32 ) {
    ptr[0] = 255;
    ptr[1] = 255;
    ptr[2] = 0;
  } else if (data.iter < 64 ) {
    ptr[0] = 155;
    ptr[1] = 25;
    ptr[2] = 93;
  } else if (data.iter < 128 ) {
    ptr[0] = 255;
    ptr[1] = 255;
    ptr[2] = 255;
  } else if (data.iter < 167 ) {
    ptr[0] = 0;
    ptr[1] = 0;
    ptr[2] = 0;
  } else if (data.iter < 256 ) {
    ptr[0] = 255;
    ptr[1] = 0;
    ptr[2] = 255;
  } else {
    ptr[0] = 105;
    ptr[1] = 255;
    ptr[2] = 255;
  }

}

int writePNG (mandelbrot& m) {

  FILE *fp = fopen(FRACTAL_FILE, "wb");
  if ( ! fp ) {
    return 1;
  }

  // Setup write struct
  png_structp png_ptr = png_create_write_struct(PNG_LIBPNG_VER_STRING,
      NULL, NULL, NULL);
  if ( png_ptr == NULL ) {
    std::cerr << "Couldn't make png pointer\n";
    abort();
  }

  // Setup info struct
  png_infop png_info = png_create_info_struct(png_ptr);
  if ( png_info == NULL ) {
    std::cerr << "Couldn't make png info pointer\n";
    abort();
  }

  // Setup Exception handling
  if (setjmp(png_jmpbuf(png_ptr))) {
    std::cerr << "Error during png creation\n";
    // warning... files are still open
    return 1;
  }

  png_init_io(png_ptr, fp);

  unsigned width = m.get_pixel_width();
  unsigned height = m.get_pixel_height();

  // Write header (8 bit colour depth)
  png_set_IHDR(png_ptr, png_info, width, height,
    8, PNG_COLOR_TYPE_RGB, PNG_INTERLACE_NONE,
    PNG_COMPRESSION_TYPE_BASE, PNG_FILTER_TYPE_BASE);

  // set PNG title
  // TODO: something cause a segmentation fault. I wonder if it is the
  // strcpy. I get a warning when I try to set a const char * to the text value.
  //
  /*
  png_text title_text;
  title_text.compression = PNG_TEXT_COMPRESSION_NONE;
  strcpy(title_text.key , "Title");
  strcpy(title_text.text , "Mandelbrot");
  png_set_text(png_ptr, png_info, &title_text, 1);
  */

  png_write_info(png_ptr, png_info);

  // Allocate memory for one row (3 bytes per pixel - RGB)
 // png_bytep row = (png_bytep) malloc(3 * width * sizeof(png_byte));
  png_bytep row = new png_byte[3 * width * sizeof(png_byte)];


  // Write image data
  int x, y;
  for (y=0 ; y<height ; y++) {
    for (x=0 ; x<width ; x++) {
      setRGB(&(row[x*3]), m.imgData(x,y));
    }
    png_write_row(png_ptr, row);
  }


  // End write
  png_write_end(png_ptr, NULL);


  // ============ CLEANUP ============

  if ( fp ) {
    fclose(fp);
  }
  if ( row ) {
    //free(row);
    delete [] row;
  }
  if (png_info != NULL) png_free_data(png_ptr, png_info, PNG_FREE_ALL, -1);
  if (png_ptr != NULL) png_destroy_write_struct(&png_ptr, (png_infopp)NULL);

  return 0;

}


int main (int argc, char * argv[]) {
  using namespace std;
  cout << endl;

  time_t timer;
  time(&timer);
  mandelbrot m;
  double total_seconds = difftime(time(NULL), timer);
  cout << "IT TOOK " << total_seconds << " seconds\n";

  writePNG(m);


  cout << endl;
  return 0;
}
