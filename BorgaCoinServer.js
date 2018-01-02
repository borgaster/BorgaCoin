const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const ip = require('ip');
const localAddress = 'http://'+ ip.address() + ':' + port;
const routes = require('./BorgaCoinRoutes'); // importing route
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
routes(app, localAddress); // register the route
app.listen(port);

console.log('RESTful API server started on: ' + port);
