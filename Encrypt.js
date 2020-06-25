
class RSA {
    /**
     * Encrypts a a 8-16 character message by breaking it down into 4 character blocks and encoding them using RSA and a private key 
     * of a size 2^n
     * 
     * Information: 
     * p = 2^17-1, q = 2^19-1, n = pq = 68718821377
     * lambda(n) = lcm(p-1,q-1) = lcm(2^16, 2^18) = 2^18 = q - 1
     * e = key
     * 
     * @param {string} msg - the message to be encrypted
     * 
     * @param {int} key - the key to be used, an integer coprime to our private key
     * 
     * @returns {}
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

        // Initialize m[]
        for(let i = 0; i < b; i++){
            m[i] = new Array(16);
            
            // Initialize m[i]
            for(let j = 0; j < 16; j++){
                // Assign m[i] the value of the unicodes for characters at positions 64i+4j,...,64i+4j+3 in msg
                m[i] = ( msg.charCodeAt(64*i + 4*j + 0) << 24| msg.charCodeAt(64*i + 4*j + 1) << 16 | msg.charCodeAt(64*i + 4*j + 2) << 8 | msg.charCodeAt(64*i + 4*j + 3) << 0)
            }
        }

        /** The RSA modulus */
        var n = 68718821377;
        /** The array of integers to encrypt */
        var c = new Array(b * 16);

        // Encrypt the message array using RSA and public-key (n,key)
        for(let i = 0; i < m.length; i++){ // Iterate over the first row of m
            for(let j = 0; j < 16; j++){ // Iterate over each block of integers
                if(m[i] != null && m[i] != 0){ // Check that the block isn't empty

                    // Set c[i] = m[i]^key (mod n)
                    c[i] = ModularExp(m[i], key, n);
                }
            }
        }

        /** The converted text of the cipher array to be returned after encryption */
        var cipher = "";

        // Turn the cipher array back into text
        for(let i = 0; i < b; i++){ // Iterate over each bloack
            for(let j = 0; j < 16; j++){ // Iterate over each set of integers
                for(let k = 0; k < 4; k++){ // Iterate over each char

                    // Slice off the kth integer from c[16i+j] and turn it into unicode 
                    var tempText = String.fromCharCode(c[i * 16 + j].slice(k, k+1));

                    // Append the unicode to cipher
                    cipher += tempText;
                }
            }
        }

        console.log(cipher);
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
        fact = (base * fact) % modulus; 
    }

    return fact;
}

export default RSA;
