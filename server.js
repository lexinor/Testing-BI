var express = require('express');
var bodyParser = require('body-parser');
var module = require('./test');
var mysql = require('mysql');

var app = express();
app.use(bodyParser.json()); // pour supporter json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); //  pour supporter  encoded url

app.get('/',(req,res) => {
    console.log("Page d'accueil");
    module.direBonjour();
    module.direBonsoir();

    res.end();
});

app.get('/login',() => {

});

app.listen(8080);