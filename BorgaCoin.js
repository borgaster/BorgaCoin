//Test api
const fetch = require('node-fetch');
const crypto = require('crypto');
const eccrypto = require('eccrypto');
// A new random 32-byte private key.
const privateKey = crypto.randomBytes(32);
// Corresponding uncompressed (65-byte) public key.
const publicKey = eccrypto.getPublic(privateKey);
const fetchOptionsGet = {
  mode: 'no-cors',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
  },
};

const fetchOptionsPost = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  method: "POST",
  body: JSON.stringify({privateKey: privateKey, 
      publicKey: publicKey, 
      data:{sender:"1234", 
            receiver:"4321", 
            amount:100}})
}

fetch('http://localhost:3000/getChain', fetchOptionsGet)
  .then( (response) => response.json() )
  .then((json) => {
    chain = JSON.parse(json);
    //console.log(chain.length);
    chain.forEach((item) => {
      console.log(item.hash);
    })
});

fetch('http://localhost:3000/send', fetchOptionsPost)
  .then((response) => response.json() )
  .then((json) => {
    console.log(json);
  });



