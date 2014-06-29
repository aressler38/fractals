define(function() {

    /**
     * @constructor
     */
    function Mandelbrot(userConfig) {
        var config = {
            x: [-2.5, 1.0],
            y: [-1.0, 1.0],
            xres: 800,
            yres: 600
        }

        var buffer = null;
        var bufferLength = null;
        var bufferView = null;

        var width = 4;
        var height = 2;

        var pixelArraySize = 32;
        var dibSize = 108;  // Number of bytes in DIB header block (fixed);
        var bmpSize = 122 + pixelArraySize;
        var bmpOffset = 14 + dibSize;
        var bitmapSize = width * height * 4; // 32 bit img

        bufferLength = 14 + dibSize + bitmapSize;
        buffer = new ArrayBuffer(pixelArraySize);
        bufferView = new DataView(buffer);

        /*
        // WRITE BMP HEADER
        bufferView.setUint16(0x0, 0x424D     ); // "BM"
        bufferView.setUint32(0x2, bmpSize    ); // size of file 
        bufferView.setUint16(0x6, 0x0000     ); // app reserved...
        bufferView.setUint16(0x8, 0x0000     ); // app reserved...
        bufferView.setUint32(0xA, bmpOffset  );

        // Write DIB HEADER
        bufferView.setUint32(0xE,  dibSize  ); 
        bufferView.setUint32(0x12, width); 
        bufferView.setUint32(0x16, height); 
        bufferView.setUint16(0x1A, 1); // number of color planes being used
        bufferView.setUint16(0x1C, 32); // number of bits per pixel
        bufferView.setUint32(0x1E, 3); // BI_BITFIELDS, no compression
        bufferView.setUint32(0x22, bitmapSize); // Size of pixel array, bytes
        bufferView.setUint32(0x26, 2835); // horizontal print resolution (72DPI)
        bufferView.setUint32(0x2A, 2835); // horizontal print resolution (72DPI)
        bufferView.setUint32(0x2E, 0); // Number of colors in palette
        bufferView.setUint32(0x32, 0); // 0 := all colors are imported
        bufferView.setUint32(0x36, 0x0000FF00); // RED chanel bit mask 
        bufferView.setUint32(0x3A, 0x00FF0000); // GREEN chanel bit mask 
        bufferView.setUint32(0x3E, 0xFF000000); // BLUE chanel bit mask 
        bufferView.setUint32(0x42, 0x000000FF); // ALPHA chanel bit mask
        bufferView.setUint32(0x46, 0x206E6957); // little endian "Win "
        bufferView.setUint32(0x4A, 0x0); // CIEXYZTRIPLE, unused for "Win "
        bufferView.setUint32(0x4E, 0x0); // CIEXYZTRIPLE, unused for "Win "
        bufferView.setUint32(0x52, 0x0); // CIEXYZTRIPLE, unused for "Win "
        bufferView.setUint32(0x56, 0x0); // CIEXYZTRIPLE, unused for "Win "
        bufferView.setUint32(0x5A, 0x0); // CIEXYZTRIPLE, unused for "Win "
        bufferView.setUint32(0x5E, 0x0); // CIEXYZTRIPLE, unused for "Win "
        bufferView.setUint32(0x62, 0x0); // CIEXYZTRIPLE, unused for "Win "
        bufferView.setUint32(0x66, 0x0); // CIEXYZTRIPLE, unused for "Win "
        bufferView.setUint32(0x6A, 0x0); // CIEXYZTRIPLE, unused for "Win "
        bufferView.setUint32(0x6E, 0x0); // 0 Red Gamma , unused for "Win "
        bufferView.setUint32(0x72, 0x0); // 0 Green Gamma , unused for "Win "
        bufferView.setUint32(0x76, 0x0); // 0 Blue Gamma , unused for "Win "
        */

        // Write Pixel Array (the bitmap image data)
        /*
        bufferView.setUint32(0x7A, 0xFF00007F);
        bufferView.setUint32(0x7E, 0xFF00007F);
        bufferView.setUint32(0x82, 0xFF00007F);
        bufferView.setUint32(0x86, 0xFF00007F);

        bufferView.setUint32(0x8A, 0xFF0000FF);
        bufferView.setUint32(0x8E, 0xFF0000FF);
        bufferView.setUint32(0x92, 0xFF0000FF);
        bufferView.setUint32(0x96, 0xFFFF00FF);
        */

        bufferView.setUint32(0x00, 0x000000FF);
        bufferView.setUint32(0x04, 0x000000FF);
        bufferView.setUint32(0x08, 0x000000FF);
        bufferView.setUint32(0x0C, 0x000000FF);

        bufferView.setUint32(0x10, 0xFF0000FF);
        bufferView.setUint32(0x14, 0xFF0000FF);
        bufferView.setUint32(0x18, 0xFF0000FF);
        bufferView.setUint32(0x1C, 0x0000FFFF);
        
        return buffer;
    }

    return Mandelbrot;
});
