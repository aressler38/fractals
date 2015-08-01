#ifndef __mandelbrot_h__
#define __mandelbrot_h__

#include "matrix.h"

class mandelbrot {

  private:
    typedef unsigned u_int;
    typedef double _cordinate_box_[4];

  public:
    mandelbrot(double xmin=-2.5, double ymax=1.25, double xmax=1.0, double ymin=-1.25) ;
    //mandelbrot(double xmin=-0.25, double ymax=-1.0, double xmax=0.25, double ymin=-0.77) ;
    //mandelbrot(double xmin=-0.25, double ymax=-1.0, double xmax=0.0, double ymin=-0.642857) ;

    ~mandelbrot ();

    typedef struct img_datum {
      img_datum(double a=-1.0, unsigned i=-1) : area(a), iter(i) { }
      double area;
      unsigned iter;
    } img_datum;
    unsigned get_pixel_width() const;
    unsigned get_pixel_height() const;
    matrix<img_datum> imgData;
    static unsigned MAX_ITER;
    _cordinate_box_ boundingbox;

};


#endif
