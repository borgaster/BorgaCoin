const BorgaCoinChain = require("./BorgaCoinChain");

const BorgaCoinAPI = (function(){
    let borgaCoinChain = BorgaCoinChain();
    function getChain(req, res){
        let chain = borgaCoinChain.getChain();
        res.json(chain)
    }
})()