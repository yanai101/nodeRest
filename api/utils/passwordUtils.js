const crypto = require('crypto');


class PasswordUtils {
    constructor(algorithm = 'aes-256-cbc', salt='3zTvzr3p6Z3461jmV54rIYu1545x4TlY',iv = Buffer.alloc(16)) {
        this.algorithm = algorithm;
        this.salt = salt;
        this.iv = iv;
    }

    encrypt(text){
        //let iv = new Buffer.alloc(16); // fill with zeros
        let cipher = crypto.createCipher(this.algorithm,this.salt);
        let crypted = cipher.update(text,'utf8','hex')
        crypted += cipher.final('hex');
        return crypted;
    }


     decrypt(text){
        let decipher = crypto.createDecipher(this.algorithm,this.salt)
        let dec = decipher.update(text,'hex','utf8')
        dec += decipher.final('utf8');
        return dec;
      }
}

module.exports = PasswordUtils;