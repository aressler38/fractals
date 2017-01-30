define(function () {

    /**
     * @param {Object} userConfig  
     * @returns {ArrayBuffer} buffer This is a pixel array representing a
     *      32-bit image with dimensions (width x height).
     */
    function mandelbrot (userConfig) {
      var config = {
        // cartesian coordinates for extrema
        x: [-2.5, 1.0],
        y: [-1.25, 1.25],
        // pixel width x height
        width: 800,
        height: 600,
      },
			param;

      for (param in userConfig) {
        config[param] = userConfig[param];
      }

      var buffer = null;
      var bufferView = null;
      var i, j, idy, iwidth;
      var x, y, x0, y0; // computed coordinates
      var xtemp;
      var offset = 0; // keep track of the byte offset in the loops
      var iteration = 0;
      var totalIterations = 0;
			// consts 
      var width = parseInt(config.width);
      var height = parseInt(config.height);
      var X = Math.abs(config.x[1] - config.x[0]); // Length
      var Y = Math.abs(config.y[1] - config.y[0]); // Length
      var dx = X/width; 
      var dy = Y/height; 
      var xmin = Math.min.apply(null, config.x);
      var ymin = Math.min.apply(null, config.y);
      var xmax = xmin + X;
      var ymax = ymin + Y;
      var bitmapSize = width * height * 4; // 32 bit img
      var MAX_ITERATION = 1024;

      buffer = new ArrayBuffer(bitmapSize);
      bufferView = new DataView(buffer);

      // Write the pixel array
      for (i=0; i<height; ++i) {          // for each row, 
				idy = i*dy;
				iwidth = i*width

        for (j=0; j<width; ++j) {       // iterate over each column.
          offset = 4*(iwidth + j);   // byte offset
          y0 = ymax - idy;
          x0 = xmin + j*dx;
          x  = 0.0;
          y  = 0.0;
          iteration = 0;
          
          while (x*x + y*y < 4 && iteration < MAX_ITERATION) {
            xtemp = x*x - y*y + x0;
            y = 2*x*y + y0;
            x = xtemp;
            ++iteration;
          }

          totalIterations += iteration;
          bufferView.setUint32(offset, palette(iteration));
        }
      }

			// color is rgba => 0xrrggbbaa
      function palette (iteration) {
        var black = 0x000000ff,
					color = ((iteration % 0xff) << 24) +
						((iteration % 0x33) << 16) +
						((iteration % 0x66) << 8) +
						black;

        return color;
      }
      
      return {
				buffer:buffer,
				iterations:totalIterations,
			};
    }

    return mandelbrot;

});
