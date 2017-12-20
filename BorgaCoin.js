let BorgaCoinBlock = require("./BorgaCoinBlock.js");
let BorgaCoinChain = require("./BorgaCoinChain");

var crypto = require("crypto");
var eccrypto = require("eccrypto");
 
// A new random 32-byte private key. 
var privateKey = crypto.randomBytes(32);
// Corresponding uncompressed (65-byte) public key. 
var publicKey = eccrypto.getPublic(privateKey);



BorgaCoinChain((borgaCoin)=>{
  let lastCoin = borgaCoin.getLatestBlock();
  BorgaCoinBlock(new Date().getTime(),{amount: 100}, privateKey, publicKey, lastCoin.hash).then((coin) =>{
    borgaCoin.addBlock(coin);
    //console.log(borgaCoin.getChain());
   // console.log(borgaCoin.isChainValid());
  })
});

