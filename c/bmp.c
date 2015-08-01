#include <stdlib.h>
#include <stdio.h>
#include <string.h>

typedef struct {
    unsigned short type;  // Magic id
    unsigned int size;  // byte count of file size
    unsigned short int reserved1, reserved2;
    unsigned short int offset; // Number of bytes that offsets the image data block.
} BMPHEADER;

typedef struct {
    unsigned int size;               /* Header size in bytes      */
    int width,height;                /* Width and height of image */
    unsigned short int planes;       /* Number of colour planes   */
    unsigned short int bits;         /* Bits per pixel            */
    unsigned int compression;        /* Compression type          */
    unsigned int imagesize;          /* Image size in bytes       */
    int xresolution,yresolution;     /* Pixels per meter          */
    unsigned int ncolours;           /* Number of colours         */
    unsigned int importantcolours;   /* Important colours         */
} BMPINFO;

void writeHead (BMPHEADER *);
void writeInfo (BMPINFO *);

void writeHead (BMPHEADER * head)
{
    head->type = 0x4D42;
    head->size = 0x0;
    head->reserved1 = 0x0;
    head->reserved2 = 0x0;
    head->offset = 14;
    return;
}



int main (int argc, char *argv[]) 
{
    FILE *f;
    unsigned char *img = NULL;

    BMPHEADER head; 
    BMPINFO info;

    writeHead( &head );

    int w = 768;
    int h = 768; 

    int red[w][h];
    int green[w][h];
    int blue[w][h];

    int x,y;
    int r,g,b;

    int filesize = 54 + 3*w*h;  //w is your image width, h is image height, both int
    int i,j;

    printf("\n\n");

    printf("Initializing rgb.\n");
    for (i=0; i<w; i++) {
        for (j=0; j<h; j++) {
            red[i][j] = 0 % 255;
            blue[i][j] = i % 255;
            green[i][j] = j % 255;
        }
    }

    //if ( img ) { free( img ); }

    img = (unsigned char *) malloc(3*w*h);

    //memset(img, 0, sizeof(img) );
    //printf("%d\n\n", sizeof(img));

    for(i=0; i<w; i++) {
        for(j=0; j<h; j++) {
            x=i; y=(h-1)-j;
            //y=(yres-1)-j;

            r = red[i][j];
            g = green[i][j];
            b = blue[i][j];

            img[(x+y*w)*3+2] = (unsigned char)(r);
            img[(x+y*w)*3+1] = (unsigned char)(g);
            img[(x+y*w)*3+0] = (unsigned char)(b);
        }
    }

    unsigned char bmpfileheader[14] = {'B','M', 0,0,0,0, 0,0, 0,0, 54,0,0,0};
    unsigned char bmpinfoheader[40] = {40,0,0,0, 0,0,0,0, 0,0,0,0, 1,0, 24,0};
    unsigned char bmppad[3] = {0,0,0};

    printf("creating the file headers...\n");
    bmpfileheader[ 2] = (unsigned char)(filesize    );
    bmpfileheader[ 3] = (unsigned char)(filesize>> 8);
    bmpfileheader[ 4] = (unsigned char)(filesize>>16);
    bmpfileheader[ 5] = (unsigned char)(filesize>>24);

    printf("creating the file info headers...\n");
    bmpinfoheader[ 4] = (unsigned char)( w     );
    bmpinfoheader[ 5] = (unsigned char)( w>> 8 );
    bmpinfoheader[ 6] = (unsigned char)( w>>16 );
    bmpinfoheader[ 7] = (unsigned char)( w>>24 );
    bmpinfoheader[ 8] = (unsigned char)( h     );
    bmpinfoheader[ 9] = (unsigned char)( h>> 8 );
    bmpinfoheader[10] = (unsigned char)( h>>16 );
    bmpinfoheader[11] = (unsigned char)( h>>24 );

    printf("THE INFO HEADER  is %s\n\n", bmpinfoheader);
    printf("Opening file for writing in binary mode.\n");
    f = fopen("img.bmp","wb");
    fwrite(bmpfileheader,1,14,f);
    fwrite(bmpinfoheader,1,40,f);

    for(i=0; i<h; i++) {
        fwrite(img+(w*(h-i-1)*3),3,w,f);
        fwrite(bmppad,1,(4-(w*3)%4)%4,f);
    }

    printf("Finished.\n\n");
    fclose(f);
    free(img);
    return 0;
}
