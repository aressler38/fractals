#include <stdio.h>
#include <stdint.h>

int is_little_endian(void);

int main (int argc, char *argv[]) 
{

    printf("\n\n");
    printf("THIS IS AN ENDIANNESS CHECK\n\n");
    printf("is_little_endian=%d\n", is_little_endian());
    printf("DONE.\n\n");
    return 0;
}

int is_little_endian(void) 
{
    union {
        uint32_t i;
        char c[4];
    } my_binary_int = {0x424D}; // "BM"
    return my_binary_int.c[0] == 'M'; // returns "M" in little-endian
}
