/* let BorgaCoinBlock = require('./BorgaCoinBlock.js');
let BorgaCoinChain = require('./BorgaCoinChain');

var crypto = require('crypto');
var eccrypto = require('eccrypto');

// A new random 32-byte private key.
var privateKey = crypto.randomBytes(32);
// Corresponding uncompressed (65-byte) public key.
var publicKey = eccrypto.getPublic(privateKey);


BorgaCoinChain((borgaCoin)=>{
  let lastCoin = borgaCoin.getLatestBlock();
  BorgaCoinBlock(new Date().getTime(), {amount: 100}, privateKey, publicKey, lastCoin.hash).then((coin) =>{
    borgaCoin.addBlock(coin);
    // console.log(borgaCoin.getChain());
   // console.log(borgaCoin.isChainValid());
  });
});
*/
const fetch = require('node-fetch');
let BorgaCoinBlock = require('./BorgaCoinBlock.js');
const crypto = require('crypto');
const eccrypto = require('eccrypto');
// A new random 32-byte private key.
const privateKey = crypto.randomBytes(32);
// Corresponding uncompressed (65-byte) public key.
const publicKey = eccrypto.getPublic(privateKey);
const fetchOptions = {
  mode: 'no-cors',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
  },
};
fetch('http://localhost:3000/getChain', fetchOptions)
  .then( (response) => response.json() )
  .then((json) => {
    chain = JSON.parse(json);
    console.log(chain);
});

/*BorgaCoinBlock(new Date().getTime(), {amount: 100}, privateKey, publicKey, lastCoin.hash).then((coin) =>{
  let options = {
    uri: 'http://localhost:3000',
    method: 'POST',
    json: JSON.stringify(coin),
  };
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body.id) // Print the shortened url.
    }
  });

});*/


