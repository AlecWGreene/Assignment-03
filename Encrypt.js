
class RSA {
    /** should the program print to console? */
    isDebugging = false;

    // Use these to debug
    static Debug() { 
        RSA.isDebugging = true; 
        RSA.Encrypt("Alec Greene Wade",13);
        RSA.isDebugging = false;
    }   

    /**
     * Encrypts a a 8-16 character message by breaking it down into 4 character blocks and encoding them using RSA and a private key 
     * of a size 2^n
     * 
     * Information: 
     * p = 2^17-1, q = 2^19-1, n = pq = 68718821377
     * lambda(n) = lcm(p-1,q-1) = lcm(2^17-1, 2^19-1) = 2^18 = q - 1 TODO: Adjust math  
     * e = key
     * 
     * @param {string} msg the message to be encrypted
     * 
     * @param {int} key the key to be used, an integer coprime to our private key
     * 
     * @returns {string} a string as an encrypted ciphertext
     * 
     */
    static Encrypt(msg, key){
        /** The length of the message counting for a 1 bit and a length bit, since the 1 bit isn't used in unicode */
        var l = msg.length / 4 + 2;
        /** The number of 16-bit blocks needed to encode the message, 4 chars ~ 16 bits */
        var b = Math.ceil(l / 16);
        /** The array representing the message broken down into a Nx16 array of 4 bit integers */
        var m = new Array(b);
        /** A prime 2^17-1 which is a factor of the modulus */
        var p = 131071;
        /**  A prime 2^19-1 which is a factor of the modulus  */
        var q = 524287;

        if(RSA.isDebugging){ console.log("l,b,m: ", l, b, m.length);} // console log l, b, m

        if(RSA.isDebugging){
            var debugM = new Array(b);

            // Initialize
            for(let i = 0; i < b; i++){
            debugM[i] = new Array(16);
            
                // Initialize debugM[i]
                for(let j = 0; j < 16; j++){
                    // Assign m[i][j] the value of the unicodes for characters at positions 64i+4j,...,64i+4j+3 in msg
                    debugM[i][j] = (msg.charCodeAt(64*i + 4*j + 0) << 24).toString(2) + "|" + (msg.charCodeAt(64*i + 4*j + 1) << 16).toString(2) + "|" + (msg.charCodeAt(64*i + 4*j + 2) << 8).toString(2) + "|" + (msg.charCodeAt(64*i + 4*j + 3) << 0).toString(2);
                    console.log(debugM[i][j]);
                }
        }

        }

        // Initialize m[]
        for(let i = 0; i < b; i++){
            m[i] = new Array(16);
            
            // Initialize m[i]
            for(let j = 0; j < 16; j++){
                // Assign m[i][j] the value of the unicodes for characters at positions 64i+4j,...,64i+4j+3 in msg
                m[i][j] = ( msg.charCodeAt(64*i + 4*j + 0) << 24| msg.charCodeAt(64*i + 4*j + 1) << 16 | msg.charCodeAt(64*i + 4*j + 2) << 8 | msg.charCodeAt(64*i + 4*j + 3) << 0)
            }
        }


        /** The RSA modulus */
        var n = 68718821377;
        /** The array of integers to encrypt */
        var c = new Array(b * 16);

        // Encrypt the message array using RSA and public-key (n,key)
        for(let i = 0; i < m.length; i++){ // Iterate over the first row of m
            for(let j = 0; j < 16; j++){ // Iterate over each block of integers
                if(m[i][j] != null && m[i][j] != 0){ // Check that the block isn't empty

                    // Set c[i] = m[i]^key (mod n)
                    c[i * 16 + j] = ModularExp(m[i][j], key, n);

                    if(RSA.isDebugging){ console.log("m["+i+"]["+j+"]: ", m[i][j].toString(2), "\n" + "c["+i+"]["+j+"]: ", c[i * 16 + j].toString(2), "\n")} // console log m[i] and c[i]
                }
            }
        }
        console.log(c.toString()); // DELETE

        /** The converted text of the cipher array to be returned after encryption */
        var cipher = "";

        // Turn the cipher array back into text
        for(let i = 0; i < b; i++){ // Iterate over each bloack
            for(let j = 0; j < 16; j++){ // Iterate over each set of integers
                for(let k = 0; k < 4; k++){ // Iterate over each char
                    console.log(i, j, k);

                    if(c[i * 16 + j] != null){
                        // Slice off the kth integer from c[16i+j] and turn it into unicode 
                        var tempText = String.fromCharCode(c[i * 16 + j].toString(2).slice(k, k+1));

                        // Append the unicode to cipher
                        cipher += tempText;

                        if(RSA.isDebugging){ console.log("Cipher: ", cipher, +"\n tempText: ", tempText);}
                    }
                }
            }
        }

        console.log("Cipher: ", cipher, "\nCipher Code: ", c.toString(2));
        return cipher;
    }
}

/** 
 * Computes and returns b^e (mod n)
 * 
 * @param {int} base  the base of the expression
 * 
 * @param {int} exp  the exponent of the expression
 * 
 * @param {int} mod  the modulus of the expression
 * 
 * @returns {int} an integer module n congruent to base^exp
 * 
 */
function ModularExp(base, exp, mod) {

    /** Modular exponentiation factor */
    var fact = 1;

    // Repeatedly multiply base by itself modulo mod until the result is base^exp (mod mod)
    for (let i = 1; i <= exp; i++) { 
        fact = (base * fact) % mod; 
    }

    return fact;
}



