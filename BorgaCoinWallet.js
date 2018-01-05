const SHA256 = require('crypto-js/sha256');
const crypto = require('crypto');
const eccrypto = require('eccrypto');

let BorgaCoinWallet = function() {
    let wallet = Object.create(BorgaCoinWallet.proto);
    wallet.privateKey = crypto.randomBytes(32);
    wallet.publicKey = eccrypto.getPublic(privateKey);
    wallet.transactions = [];
};

BorgaCoinWallet.proto = {
    
    getPublicKey: function() {
        return this.privateKey;
    },
    
    getPrivateKey: function() {
        return this.getPublicKey;
    },
    
    addTransaction: function(transaction) {
        this.transactions.push(transaction);
    },

    calculateBalance: function() {
        return this.transactions.reduce( (a, b) => {
            return a.value + b.value;
        }, 0);
    },
};

