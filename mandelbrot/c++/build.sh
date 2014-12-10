#!/bin/bash -x

g++ -std=c++11 main.cpp mandelbrot.cpp -l png -l z -o fractal 
