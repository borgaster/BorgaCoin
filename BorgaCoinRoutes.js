'use strict';
module.exports = function(app) {
    const BorgaCoinChain = require('./BorgaCoinChain');
    const BorgaCoinBlock = require('./BorgaCoinBlock.js');
    let borgaCoin = null;
    BorgaCoinChain(function(chain) {
        borgaCoin = chain;
    });
    console.log('Request');
    
    app.route('/getChain')
    .get(function(req, res) {
        let chain = borgaCoin.getChain();
        res.json(JSON.stringify(chain));
    });
    app.route('/send')
    .post(function(req, res) {
        console.log(req.body);
        let block = BorgaCoinBlock(new Date().getTime(), {amount: req.body});
        borgaCoin.addBlock(block);
        res.json('{test: OK}');
    });
       
    app.route('/latestBlock').get(function(req, res) {
        res.json(borgaCoin.getLatestBlock());
    });
};