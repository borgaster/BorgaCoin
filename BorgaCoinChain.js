let BorgaCoinBlock = require("./BorgaCoinBlock.js");
const crypto = require("crypto");
const eccrypto = require("eccrypto");

let BorgaCoinChain = function(callback){
    let coinChain = Object.create(BorgaCoinChain.proto);
    coinChain.difficulty = 2;
    coinChain.publicKey = ''; //Miner's wallet, where reward is credited.
    coinChain.createGenesisBlock().then((obj) => {
        coinChain.chain = [obj]
        callback(coinChain);
    })
}

BorgaCoinChain.proto = {
    createGenesisBlock: function(){
        return new Promise((resolve, reject) => {
            // A new random 32-byte private key. 
            let privateKey = crypto.randomBytes(32);
            // Corresponding uncompressed (65-byte) public key. 
            let publicKey = eccrypto.getPublic(privateKey);
            BorgaCoinBlock(new Date().getTime()
            , "Genesis Block!",privateKey, publicKey, "0").then((obj) =>{
                resolve(obj)
            });
        })
        
    },

    getLatestBlock: function(){
        return this.chain[this.chain.length - 1];
    },

    addBlock: function(newBlock){
        this.mineBlock(newBlock);
        this.verifySignature(newBlock).then((result)=>{
            if(result){
                console.log("signature OK");
                this.chain.push(newBlock);
            }
            else{
                console.log("signature is invalid");
            }
        });
    },

    verifySignature: function(newBlock){
        return new Promise((resolve, reject) => {
            let transactionToStr = newBlock.previousHash + 
            newBlock.timeStamp + 
            JSON.stringify(newBlock.data) 
            let toSign = crypto.createHash("sha256").
                update(transactionToStr).digest().toString();
            eccrypto.verify(newBlock.publicKey, toSign, newBlock.signature).then(function() {
                console.log("Signature is OK");
                resolve(true);
            }).catch(function() {
                console.log("Signature is BAD");
                resolve(false);
            });
        });  
    },

    isChainValid: function(){
        for(let index = 1; index < this.chain.length; i++){
            const currentBlock = this.chain[index];
            const prevBlock = this.chain[index - 1];
            let hash = currentBlock.calculateHash();
            let block = currentBlock;
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false; //Hash is not valid
            }
            if(currentBlock.previousHash !== prevBlock.hash){
                return false; //Previous hash doesn't match previous block's hash
            }
            return true; //Blockchain is valid!
        }
    },

    getChain: function(){
        return this.chain;
    },

    mineBlock: function(newBlock){
        while (newBlock.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")) {
            newBlock.nonce++;
            newBlock.hash = newBlock.calculateHash();
        }
        console.log("BLOCK MINED: " + newBlock.hash);
        //TODO: add reward to miner's public key
        
    }
}

module.exports = BorgaCoinChain;