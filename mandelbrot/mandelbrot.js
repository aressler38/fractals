define(function() {

    /**
     * @param {Object} userConfig  
     * @returns {ArrayBuffer} buffer This is a pixel array representing a
     *      32-bit image with dimensions (width x height).
     */
    function mandelbrot(userConfig) {
        var config = {
            // cartesian coordinates for extrema
            x: [-2.5, 1.0],
            y: [-1.25, 1.25],
            // pixel width x height
            width: 800,
            height: 600
        }
        for (var param in userConfig) {
            config[param] = userConfig[param];
        }

        var buffer = null;
        var bufferView = null;
        var i, j; // counters
        var x, y, x0, y0; // computed coordinates
        var xtemp;
        var offset = 0; // keep track of the byte offset in the loops
        var iteration = 0;
        var totalIterations = 0;
        const width = parseInt(config.width);
        const height = parseInt(config.height);
        const X = Math.abs(config.x[1] - config.x[0]); // Length
        const Y = Math.abs(config.y[1] - config.y[0]); // Length
        const dx = X/width; 
        const dy = Y/height; 
        const xmin = Math.min.apply(this, config.x);
        const ymin = Math.min.apply(this, config.y);
        const xmax = xmin + X;
        const ymax = ymin + Y;
        const bitmapSize = width * height * 4; // 32 bit img
        const MAX_ITERATION = 1000;

        buffer = new ArrayBuffer(bitmapSize);
        bufferView = new DataView(buffer);

        // Write the pixel array
        for (i=0; i<height; i++) {          // for each row, 
            for (j=0; j<width; j++) {       // iterate over each column.
                offset = 4*(i*width + j);   // byte offset
                y0 = ymax - i*dy;
                x0 = xmin + j*dx;
                x  = 0.0;
                y  = 0.0;
                iteration = 0;
                
                while ( x*x + y*y < 4 && iteration < MAX_ITERATION ) 
                {
                    xtemp = x*x - y*y + x0;
                    y = 2*x*y + y0;
                    x = xtemp;
                    iteration++;
                }

                totalIterations += iteration;
                bufferView.setUint32(offset, palette(iteration));
            }
        }

        function palette (iteration) {
            var color ;
            color = (iteration === MAX_ITERATION) ? 0x000000ff : 
                (iteration > 900) ? 0x0000ffff : 
                (iteration > 800) ? 0xf8f808ff :
                (iteration > 700) ? 0xf7f707ff : 
                (iteration > 600) ? 0xf6f6f6ff : 
                (iteration > 500) ? 0xf5f5f5ff : 
                (iteration > 400) ? 0xf4f4f4ff : 
                (iteration > 300) ? 0xf3f3f3ff : 
                (iteration > 200) ? 0xf2f2f2ff : 
                (iteration > 100) ? 0xf1f1f1ff : 
                (iteration > 50)  ? 0xaeaeaeae : 
                (iteration > 40)  ? 0xadadadff : 
                (iteration > 30)  ? 0xa0a0a0ff : 
                (iteration > 20)  ? 0x505050ff : 
                (iteration > 10)  ? 0x0222afff : 
                (iteration > 9)   ? 0x002aafff : 
                (iteration > 8)   ? 0x00ffbeff : 
                (iteration > 7)   ? 0x0030beff : 
                (iteration > 5)   ? 0x0030beff : 
                (iteration > 3)   ? 0x4af0beff : 
                (iteration > 2)   ? 0x0000ffff : 
                (iteration > 1)   ? 0xffffffff : 0xffffffff; 
            return 0xffffffff & color;
        }
        
        return {buffer:buffer, iterations:totalIterations};
    }


    return mandelbrot;
});
