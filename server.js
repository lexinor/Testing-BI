var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cors = require('cors');
var jwt = require('jsonwebtoken');

// Calling custom modules
let tester = require('./testers.js');
let tests = require('./tests.js');
//let test = require('./tests.js');
//let test = require('./tests.js');

var app = express();
app.use(bodyParser.json()); // pour supporter json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); //  pour supporter  encoded url

let con = mysql.createConnection({
    host: "localhost",
    user: "nodeuser",
    password: "node",
    database: "LicencePro"
});

// Homepage
app.get('/', function(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.send('Bonjour');
});

app.get('/private', function(req, res) {
    res.sendFile( __dirname + "/private/" + "chatmyope.jpg" );
});

//-----------------------------------Fonctions Utilisateurs-------------------------------------------------------------
// Listing all testers
app.get('/testers', function(req, res) {
    tester.getUsers(req,res);
}   );

// This method add a tester we need to send a JSON object with the user info to succeed
app.post('/testers', function(req, res) {
    tester.addUser(req,res);
});

// Delete a tester using his ID
app.delete('/testers/:uId', function (req, res) {
    tester.removeUser(req,res);
});

// This method modify a tester using his ID to select the correct user
// You need to send a JSON to modify the user infos
app.put('/testers/:uId',function (req,res) {
    tester.editUser(req,res);
})

// This method GET a specific tester using his ID
app.get('/testers/:uId', function(req, res) {
    tester.getUserById(req,res);});


//-----------------------------------Fonctions Test -------------------------------------------------------------
//Récupère tous les Testeurs
app.get('/tests', function(req, res) {
    tests.getAllTests(req,res);
});
//Crée un nouveau Test
app.post('/tests', function(req, res) {
    tests.createTest(req,res);
});
//Supprime le test selon son id et les lignes le concernant en pariticiper, en test
app.delete('/tests/:tId', function (req, res) {
    tests.removeTestById(req,res);
});
//modifie le test selon son id
app.put('/tests/:tId',function (req,res) {
    tests.editTestById(req,res);
});

//affiche un test particulier
app.get('/tests/:tId', function(req, res) {
    tests.getTestById(req,res);
});


//app.use(express.static('forms'));
app.use('/static', express.static('public'));
app.use(function(req, res, next){
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(404).send('Lieu inconnu : '+req.originalUrl);
});
app.listen(8080);