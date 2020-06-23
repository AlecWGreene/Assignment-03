class Encryption {
    
    /**
     * 
     * Processes a string into a 512 bit hash using SHA-256
     * 
     * @param {string} msg - a string in unicode to be hashed 
     * 
     */
    static process(msg){

        const K = [];

        const H = [];

        msg += String.fromCharCode(0x80); // Adds '1' bit to the end

        // initialize variables

        /** length in 32-bit integers of msg + 'l' + appended length bit */
        const l = msg.length/4 + 2; 
        /** number of 16-integer (512-bit) blocks required to hold 'l' ints */
        const N = Math.ceil(l / 16); 
        /** message M is Nx16 array of 32-bit integers */
        const M = new Array(N) 

        // Encode the msg into a N*16 array of 32-bit integers
        for(let i = 0; i < N; i++){
            M[i] = new Array(16); // Add second dimension
            for(let j = 0; j < 16; j++){
                /**
                * Stores a 32-bit integer at (i,j) value of M, where the first 8 bits are the character at position 64i+4j in message,
                * the next 8 are the character at position 64i+4j+1, etc and left-shiting by adding 0s to make sure each character
                * uses exactly 8 bits
                */
                M[i][j] = (msg.charCodeAt(i*64 + j*4 + 0) << 24 | msg.charCodeAt(i*64 + j*4 + 1) << 16 |
                           msg.charCodeAt(i*64 + j*4 + 2) << 8  | msg.charCodeAt(i*64 + j*4 + 3) << 0);
            }
        }

        // Add the length to the end of M, this is Big Endian

        /** Will put a 1 if the message is longer than 32 2^bits */
        const high = ((msg.length - 1) * 8) / (Math.pow(2, 32)); 
        /** Will record size of the message */
        const low = ((msg.length - 1) * 8) >>> 0; 

        // Store in the last two bits
        M[N-1][14] = Math.floor(high);
        M[N-1][15] = low;

        // Hash Computation
        for(let i = 0; i < N; i++){
            /** Message schedule */
            const S = new Array(64);
        }
    } 

    /**
     * 
     * @param {Int32Array} x
     * @param {Int32Array} y 
     */
    static RotateRight(x, y){
        
    }

    
}

export default Encryption;