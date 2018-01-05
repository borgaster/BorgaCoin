const BorgaCoinBlock = require('./BorgaCoinBlock.js');
const crypto = require('crypto');
const eccrypto = require('eccrypto');
const fetch = require('node-fetch');

let BorgaCoinChain = function(nodes) {
    let coinChain = Object.create(BorgaCoinChain.proto);
    coinChain.difficulty = 2;
    coinChain.privateKey = crypto.randomBytes(32);
    coinChain.publicKey = eccrypto.getPublic(coinChain.privateKey);
    coinChain.chain = [];
    coinChain.nodes = nodes;
    return coinChain;
};

BorgaCoinChain.proto = {
    getLongestChain: function(nodes) {
        const fetchOptionsGet = {
            mode: 'no-cors',
            method: 'GET',
            timeout: 3000,
            headers: {
              'Accept': 'application/json',
            },
          };
          let retreivedChains = [];
          nodes.forEach((node) => {
            retreivedChains.push(fetch(node+'/getChain', fetchOptionsGet)
                .then((result) => result.json())
                .catch( (error) => {
                    console.log(error.message);
                }));
          });
          Promise.all(retreivedChains).then((values) => {
            values.forEach((res) => {
                if (res !== undefined) {
                    let newChain = JSON.parse(res);
                    if (newChain.length > this.chain.length) {
                        console.log('got longest chain');
                        if (this.isChainValid(newChain)) {
                            this.chain = newChain;
                        } else {
                            console.log('Chain is not valid');
                        }
                    }
                }
            });
            if (this.chain.length === 0) {
                console.log('Create genesis block!');
                this.createGenesisBlock();
            }
          }).catch((error) => {
              console.log(error);
          } );
    },

    propagateNewBlock: function(nodes, block) {
        const fetchOptionsPost = {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'POST',
            timeout: 3000,
            body: JSON.stringify(block),
          };
          let resultBlockProagationPromise = [];
          nodes.forEach((item) => {
              resultBlockProagationPromise
                .push(fetch(item+'/propagate', fetchOptionsPost)
                    .catch((error) => console.log(error.message)));
          });
          Promise.all(resultBlockProagationPromise)
            .then((values) =>{
                console.log(values);
            });
    },

    createGenesisBlock: function() {
        return new Promise((resolve, reject) => {
            new BorgaCoinBlock(new Date().getTime(),
                            'Genesis Block!',
                            this.privateKey, this.publicKey, '0')
                                .then((coin) => {
                                    this.mineBlock(coin);
                                    this.chain.push(coin);
                                    resolve(coin);
                                });
        });
    },

    getLatestBlock: function() {
        return this.chain[this.chain.length - 1];
    },

    addBlock: function(newBlock) {
        this.verifySignature(newBlock).then((result)=>{
            if (result) {
                console.log('signature OK');
                this.mineBlock(newBlock);
                this.chain.push(newBlock);
                if (this.isChainValid(this.chain)) {
                    console.log('Chain is valid after new block');
                    this.propagateNewBlock(this.nodes, newBlock);
                } else {
                    console.log('Chain is no longer valid');
                    this.chain.pop();
                }
            } else {
                console.log('signature is invalid');
            }
        });
    },

    verifySignature: function(newBlock) {
        return new Promise((resolve, reject) => {
            let transactionToStr = newBlock.previousHash +
            newBlock.timeStamp +
            JSON.stringify(newBlock.data);
            let toSign = crypto.createHash('sha256').
                update(transactionToStr).digest().toString();
            eccrypto.verify(newBlock.publicKey,
                toSign,
                newBlock.signature)
                    .then(function() {
                        console.log('Signature is OK');
                        resolve(true);
                    }).catch(function() {
                        console.log('Signature is BAD');
                        resolve(false);
                    });
        });
    },

    isChainValid: function(chain) {
        for (let index = 1; index < chain.length; index++) {
            const currentBlock = chain[index];
            const prevBlock = chain[index - 1];
            let currentHash = BorgaCoinBlock
                                .calculateHash(currentBlock.previousHash,
                                                currentBlock.timeStamp,
                                                currentBlock.data,
                                                currentBlock.nonce);
            let previousHash = BorgaCoinBlock
                                .calculateHash(prevBlock.previousHash,
                                                prevBlock.timeStamp,
                                                prevBlock.data,
                                                prevBlock.nonce);
            if (currentBlock.hash !== currentHash) {
                // Hash is not valid
                return false;
            }
            if (currentBlock.previousHash !== previousHash) {
                // Previous hash doesn't match previous block's hash
                return false;
            }
        }
        return true; // Blockchain is valid!
    },

    getChain: function() {
        return this.chain;
    },

    mineBlock: function(newBlock) {
        while (newBlock.hash.substring(0, this.difficulty) !==
                Array(this.difficulty + 1).join('0')) {
            newBlock.nonce++;
            newBlock.hash = BorgaCoinBlock
                                .calculateHash(newBlock.previousHash,
                                    newBlock.timeStamp,
                                    newBlock.data,
                                    newBlock.nonce);
        }
        console.log('BLOCK MINED: ' + newBlock.hash);
        // TODO: add reward to miner's public key
    },
};

module.exports = BorgaCoinChain;
