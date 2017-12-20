const express = require('express'),
app = express(),
bodyParser = require('body-parser'),
port = process.env.PORT || 3000;

let routes = require('./BorgaCoinRoutes'); //importing route
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
routes(app); //register the route

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);