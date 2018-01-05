const fetch = require('node-fetch');
const crypto = require('crypto');
const eccrypto = require('eccrypto');
const privateKey = crypto.randomBytes(32);
const publicKey = eccrypto.getPublic(privateKey);
const fetchOptionsGet = {
  mode: 'no-cors',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
  },
};
const bodyToString = JSON.stringify(
  {
    privateKey: privateKey,
    publicKey: publicKey,
    data: {
            sender: '1234',
            receiver: '4321',
            amount: 100,
          },
  });

const fetchOptionsPost = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  method: 'POST',
  body: bodyToString,
};

fetch('http://localhost:3000/getChain', fetchOptionsGet)
  .then( (response) => response.json() )
  .then((json) => {
    let chain = JSON.parse(json);
    chain.forEach((item) => {
      console.log(item.hash);
    });
});

fetch('http://localhost:3000/send', fetchOptionsPost)
  .then((response) => response.json() )
  .then((json) => {
    console.log(json);
  });
