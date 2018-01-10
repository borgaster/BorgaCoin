const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 2000;
const routes = require('./BorgaCoinNodeRegistryRoutes'); // importing route
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
routes(app); // register the route
app.listen(port);
console.log('Node Registry Service started on: ' + port);
