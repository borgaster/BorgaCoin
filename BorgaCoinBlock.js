const SHA256 = require('crypto-js/sha256');
const crypto = require('crypto');
const eccrypto = require('eccrypto');

let BorgaCoinBlock = function(timeStamp, data, privateKey, publicKey, previousHash = '') {
    return new Promise((resolve, reject) =>{
        let obj = Object.create(BorgaCoinBlock.proto);
        obj.timeStamp = timeStamp;
        obj.data = data;
        obj.previousHash = previousHash;
        obj.hash = obj.calculateHash();
        obj.nonce = 0;
        obj.publicKey = publicKey;
        obj.signTransaction(privateKey).then((sig) =>{
            obj.signature = sig;
            resolve(obj);
        });
    });
};

BorgaCoinBlock.proto = {

    calculateHash: function() {
        return SHA256(this.previousHash +
            this.timeStamp +
            JSON.stringify(this.data) +
            this.nonce).toString();
    },

    signTransaction: function(privateKey) {
        return new Promise((resolve, reject) => {
            let transactionToStr = this.previousHash +
            this.timeStamp +
            JSON.stringify(this.data);
            let toSign = crypto.createHash('sha256').
                update(transactionToStr).digest().toString();
            eccrypto.sign(privateKey, toSign).then(function(sig) {
                // console.log("Signature in DER format:", sig);
                resolve(sig);
              }).catch(function(error) {
                  reject(error);
              });
        });
    },
};

module.exports = BorgaCoinBlock;
