class SHA {
    
    /**
     * 
     * Processes a string into a 512 bit hash using SHA-256
     * 
     * @param {string} msg - a string in unicode to be hashed 
     * 
     */
    static hash(msg){

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

            // STEP 1 -- Initialize message schedule

            // Set first N elements of S to the first N elements of M[i]
            for (let j = 0; j < N; j++){
                S[j] = M[i][t];
            }

            // Set the rest of the elements to some random shit TODO unpack the random shit
            for(let j = 16; j < 64; j++){
                S[j] = (SHA.SigmaD(S[j-2]) + S[j-7] + SHA.SigmaC(S[j-15]) + S[j-16]) >>> 0;
            }

            // STEP 2 -- Initialize working variables a,...,h with previous hash values
            let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];

            // STEP 3 -- Main loop
            for (let j = 0; j < 64; j++){
                /** Working variable */
                const T1 = h + SHA.SigmaB(e) + SHA.Choice(e, f, g) + K[j] + S[j];
                /** Working variable */
                const T2 = SHA.SigmaB(a) + SHA.Majority(a, b, c);

                //delete h, shift every letter up one, and then set a = T1+T2 mod 2^32
                h=g;
                g=f;
                f=e;
                e=d;
                d=c;
                c=b;
                b=a;
                a = (T1 + T2) >>> 0;
            }

            // STEP 4 -- Compute the new intermediate hash values
            H[0] = (H[0] + a) >>> 0;
            H[1] = (H[1] + b) >>> 0;
            H[2] = (H[2] + c) >>> 0;
            H[3] = (H[3] + d) >>> 0;
            H[4] = (H[4] + e) >>> 0;
            H[5] = (H[5] + f) >>> 0;
            H[6] = (H[6] + g) >>> 0;
            H[7] = (H[7] + h) >>> 0;
        }

        // Convert H[0],...,H[7] to hex strings (with leading zeros)
        for(let j = 0; j < H.length; j++){
            //Convert H[j] to string, prepend 8 0s and then retrieve the string 
            ('00000000' + H[j].toString()).slice(-8);
        }

        //Return H as the encrypted hash
        return H;
    } 


    /**
     * 
     * Shifts the first argument @var x to the right by @var y bits replacing with 0s, then adds y into the left part of the bit array
     * 
     * @param {Int32Array} x - the value to rotate
     * @param {Int32Array} y - the number of positions to rotate, between 0 and 32
     * 
     * @example 127 = RotateRight(00000000000000000000000001111111, 4) -> 11110000000000000000000000000111
     */
    static RotateRight(x, y){
        return ( (x >>> y) | (x << (32-y)) );
    }

    //Sigma Functions
    static SigmaA(x){
        return ( SHA.RotateRight(x, 2) ^ SHA.RotateRight(x, 13) ^ SHA.RotateRight(x, 22) );
    }
    static SigmaB(x){
        return ( SHA.RotateRight(x, 6) ^ SHA.RotateRight(x, 11) ^ SHA.RotateRight(x, 25) );
    }
    static SigmaC(x){
        return ( SHA.RotateRight(x, 7) ^ SHA.RotateRight(x, 18) ^ (x >>> 3) );
    }
    static SigmaD(x){
        return ( SHA.RotateRight(x, 17) ^ SHA.RotateRight(x, 19) ^ (x >>> 10) );
    }

    //TODO Figure out the fuck these are supposed to be
    static Choice(x, y, z){
        return (x & y) ^ (-x & z);
    }
    static Majority(x, y, z){
        return (x & y) ^ (x & z) ^ (y & z);
    }
}

export default SHA;