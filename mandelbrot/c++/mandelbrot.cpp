#include <iostream>
#include "mandelbrot.h"

#define DOTS 1200
#define MAX_ITER 1000

/**
 * Create a fractal image to be read by libpng
 */
mandelbrot::mandelbrot(double xmin, double ymax, double xmax, double ymin) 
  : boundingbox{xmin, ymax, xmax, ymin}, imgData(matrix<double>(DOTS,DOTS))
{

  double xdelta = (xmax - xmin) / DOTS;
  double ydelta = (ymax - ymin) / DOTS;

  for ( unsigned i=0; i<DOTS; ++i ) {
    for ( unsigned j=0; j<DOTS; ++j ) {
      double xc = xmin + i*xdelta;
      double yc = ymin + j*ydelta;
      double x0 = xmin + i*xdelta;
      double y0 = ymin + j*ydelta;
      double x = x0*x0 - y0*y0 + xc;
      double y = 2.0*x0*y0 + yc;
      double area = 0.0;
      unsigned iter = 0;
      do {
        area = x*x + y*y;
        x0 = x;
        y0 = y;
        x = x0*x0 - y0*y0 + xc;
        y = 2.0*x0*y0 + yc;
        ++iter;
      } while ( area < 4.0 && iter < MAX_ITER );
      imgData(i,j) = area;
      //std::cout << "PROCESSED: ("
      //<< xc << ", " << yc << ") :: " << area << " iter: " << iter <<"\n";
    }
  }

}

mandelbrot::~mandelbrot () { }

unsigned mandelbrot::get_pixel_width() const {
  return DOTS;
}

unsigned mandelbrot::get_pixel_height() const {
  return DOTS;
}
