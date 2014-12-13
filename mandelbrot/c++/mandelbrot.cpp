#include <iostream>
#include "mandelbrot.h"
#include <thread>

#define DOTS 16324

unsigned mandelbrot::MAX_ITER = 1024;

void top_thread (mandelbrot* m) {
  unsigned dots = DOTS/2;
  double xmin = m->boundingbox[0];
  double ymax = m->boundingbox[1];
  double xmax = m->boundingbox[2];
  double ymin = m->boundingbox[3];

  double xdelta = (xmax - xmin) / DOTS;
  double ydelta = (ymax - ymin) / DOTS;

  for ( unsigned i=0; i<DOTS; ++i ) {
    for ( unsigned j=0; j<dots; ++j ) {
      double xc = xmin + i*xdelta;
      double yc = ymin + j*ydelta;
      double x0 = xc;
      double y0 = yc;
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
      } while ( area < 4.0 && iter < mandelbrot::MAX_ITER );
      m->imgData(i,j) = mandelbrot::img_datum(area, iter);
    }
  }

}

void bottom_thread (mandelbrot* m) {
  unsigned dots = DOTS/2;
  double xmin = m->boundingbox[0];
  double ymax = m->boundingbox[1];
  double xmax = m->boundingbox[2];
  double ymin = m->boundingbox[3];

  double xdelta = (xmax - xmin) / DOTS;
  double ydelta = (ymax - ymin) / DOTS;

  for ( unsigned i=0; i<DOTS; ++i ) {
    for ( unsigned j=dots; j<DOTS; ++j ) {
      double xc = xmin + i*xdelta;
      double yc = ymin + j*ydelta;
      double x0 = xc;
      double y0 = yc;
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
      } while ( area < 4.0 && iter < mandelbrot::MAX_ITER );
      m->imgData(i,j) = mandelbrot::img_datum(area, iter);
    }
  }

}

/**
 * Create a fractal image to be read by libpng
 */
mandelbrot::mandelbrot(double xmin, double ymax, double xmax, double ymin) 
  : boundingbox{xmin, ymax, xmax, ymin}, 
    imgData(matrix<img_datum>(DOTS,DOTS))
{

  if ( ! true ) {
    unsigned dots = DOTS;
    double xdelta = (xmax - xmin) / dots;
    double ydelta = (ymax - ymin) / dots;

    for ( unsigned i=0; i<DOTS; ++i ) {
      for ( unsigned j=0; j<DOTS; ++j ) {
        double xc = xmin + i*xdelta;
        double yc = ymin + j*ydelta;
        double x0 = xc;
        double y0 = yc;
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
        imgData(i,j) = mandelbrot::img_datum(area, iter);
      }
    }
  } else {
    std::cout << "Creating threads...\n";
    std::thread t1(top_thread, this);
    std::thread t2(bottom_thread, this);
    std::cout << "Joining threads...\n";
    t1.join();
    t2.join();
  }
  std::cout << "DONE\n" << std::endl;

}

mandelbrot::~mandelbrot () { }

unsigned mandelbrot::get_pixel_width() const {
  return DOTS;
}

unsigned mandelbrot::get_pixel_height() const {
  return DOTS;
}
