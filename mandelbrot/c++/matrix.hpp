
template <typename T>
matrix<T>::matrix(u_int rows, u_int cols) 
  : _rows(rows), _cols(cols) 
{
  if ( rows && cols ) {
    _data = new T*[rows]; // make row pointers
    for ( u_int i=0; i<rows; ++i ) {
      _data[i] = new T[cols]; // insert a new row
      for ( u_int j=0; j<cols; ++j ) {
        _data[i][j] = 0;
      }
    }
  }
}

template <typename T>
matrix<T>::~matrix() {
  _release();
}

template <typename T>
void matrix<T>::_release() {
  for ( u_int i=0; i<_rows; ++i ) {
    delete [] _data[i];
  }
  delete [] _data;
}

template <typename T>
T& matrix<T>::operator()(const u_int i, const u_int j) {
  return _data[i][j];
}

template <typename T>
std::ostream& operator<< (std::ostream& o, matrix<T>& m) {
  for ( unsigned i=0; i<m._rows; ++i ) {
    for ( unsigned j=0; j<m._rows; ++j ) {
      std::cout << m(i,j) << " ";
    }
    std::cout << "\n";
  }
  return o;
}
