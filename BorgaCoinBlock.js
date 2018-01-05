const sha256 = require('crypto-js/sha256');
const crypto = require('crypto');
const eccrypto = require('eccrypto');

function signTransaction(previousHash, timeStamp, data, privateKey) {
    return new Promise((resolve, reject) => {
        let transactionToStr = previousHash +
        timeStamp +
        JSON.stringify(data);
        let toSign = crypto.createHash('sha256').
            update(transactionToStr).digest().toString();
        eccrypto.sign(privateKey, toSign).then(function(sig) {
            resolve(sig);
          }).catch(function(error) {
              reject(error);
          });
    });
}

function BorgaCoinBlock(timeStamp,
                        data,
                        privateKey,
                        publicKey,
                        previousHash = '') {
    return new Promise((resolve, reject) => {
        let obj = {
            timeStamp: timeStamp,
            data: data,
            previousHash: previousHash,
            nonce: 0,
            publicKey: publicKey,
            hash: BorgaCoinBlock
                .calculateHash(previousHash, timeStamp, data, this.nonce),
            signature: '',
        };
        obj.signature =
            signTransaction(previousHash, timeStamp, data, privateKey)
                .then((sig) => {
                    obj.signature = sig;
                    resolve(obj);
                });
        });
};

BorgaCoinBlock.calculateHash = function(previousHash, timeStamp, data, nonce) {
    return sha256(previousHash
        + timeStamp
        + JSON.stringify(data)
        + nonce).toString();
};

module.exports = BorgaCoinBlock;
