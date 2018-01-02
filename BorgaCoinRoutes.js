'use strict';
module.exports = function(app, localAddress) {
    const BorgaCoinChain = require('./BorgaCoinChain.js');
    const BorgaCoinBlock = require('./BorgaCoinBlock.js');
    const servers = ['http://192.168.1.12:3000', 'http://192.168.1.12:3001']
        .filter(elem => elem !== localAddress);
    let borgaCoin = BorgaCoinChain(servers);
    borgaCoin.getLongestChain(servers);

    
    app.route('/getChain')
    .get(function(req, res) {
        let chain = borgaCoin.getChain();
        res.json(JSON.stringify(chain));
    });
    app.route('/send')
    .post(function(req, res) {
        BorgaCoinBlock(new Date().getTime(), 
            req.body.data, 
            req.body.privateKey.data, 
            req.body.publicKey.data, 
            borgaCoin.getLatestBlock().hash)
            .then((block) => {
                borgaCoin.addBlock(block);
                res.json('{test: OK}');
            })  
    });

    app.route('/propagate')
        .post(function(req, res){
            borgaCoin.addBlock(JSON.parse(req.body.data));
        })
       
    app.route('/latestBlock').get(function(req, res) {
        res.json(borgaCoin.getLatestBlock());
    });
};
