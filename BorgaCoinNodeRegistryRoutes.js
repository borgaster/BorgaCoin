const fetch = require('node-fetch');
'use strict';
module.exports = function(app, localAddress) {
    let servers = [];
    const fetchOptionsGet = {
        mode: 'no-cors',
        method: 'GET',
        timeout: 3000,
        headers: {
          'Accept': 'application/json',
        },
      };
    app.route('/getNodes')
        .get((req, res) => {
            let retreivedNodes = [];
            servers.forEach((node) => {
                retreivedNodes.push(fetch(node + 'isNodeAlive', fetchOptionsGet)
                    .then((result) => console.log(node + 'is alive'))
                    .catch((error) => servers = servers
                        .filter((elem) => elem !== node)));
            });
            Promise.all(retreivedNodes).then((values) => res.json(servers));
    });

    app.route('/registerNode')
        .post((req, res) => {
            servers.push(req.body.data);
        });
};
