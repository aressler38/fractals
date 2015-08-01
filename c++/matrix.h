#ifndef _matrix_h_
#define _matrix_h_

#include <iostream>

template<typename T>
class matrix {
  typedef unsigned u_int;
  public:
    matrix(u_int=0, u_int=0);
    ~matrix();
    T& operator()(const u_int, const u_int);
    template<typename U> friend std::ostream& operator<<(std::ostream& o, matrix<U>&);
  private:
    u_int _rows;
    u_int _cols;
    T** _data;
    void _release();
};

#include "matrix.hpp"

#endif
