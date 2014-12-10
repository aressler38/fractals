#ifndef __mandelbrot_h__
#define __mandelbrot_h__

#include "matrix.h"

class mandelbrot {
  typedef unsigned u_int;
  typedef double _cordinate_box_[4];
  public:
    mandelbrot(double xmin=-2.5, double ymax=1.25, double xmax=1.0, double ymin=-1.25);
    ~mandelbrot ();
    unsigned get_pixel_width() const;
    unsigned get_pixel_height() const;
    matrix<double> imgData;
  private:
    _cordinate_box_ boundingbox;
};

#endif

