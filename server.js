var express = require('express');
let cookieParser = require('cookie-parser');
let session = require('express-session');

var bodyParser = require('body-parser');
var mysql = require('mysql');
var cors = require('cors');
var jwt = require('jsonwebtoken');

// Session handling


// Calling custom modules
let tester = require('./testers.js');
let tests = require('./tests.js');
let execute = require('./execute.js');
let test_category = require('./test_category.js');
//let test = require('./tests.js');
let version = require('./version.js');
let analyze = require('./analyze.js');
var pug = require('pug');


var app = express();
app.set('view engine', 'pug');


app.use(bodyParser.json()); // pour supporter json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); //  pour supporter  encoded url

app.use(cookieParser());
app.use(session({ secret: "toto", resave: false, saveUninitialized: false, cookie: { maxAge: 6000} }));

let con = mysql.createConnection({
    host: "localhost",
    user: "nodeuser",
    password: "node",
    database: "LicencePro"
});

let sess;

app.get('/login', (req,res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    sess = req.session;
    obj = JSON.parse(JSON.stringify(req.body, null, " "));
    let token = jwt.sign({ data: Date.now() }, 'secret', { expiresIn: '1h' });

    sess.login = obj.login;
    sess.token = token;
    if(sess.login)
        res.redirect('/login1');
    else
        res.redirect('/');
})

app.get('/login1', (req,res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    sess = req.session;
    if(sess.login){
        res.write("Bienvenue : " +sess.login);
        res.write("Votre token : " +sess.token);
        res.end();
    }
    else
        res.redirect('/');
})


// Homepage
app.get('/', function(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.send('Bonjour');
});

app.get('/test', function (req, res) {
    res.render('index');
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

//--------------------Execute --------------------------------------------------
app.get('/execute', function(req, res) {
   execute.getAllExecute(req,res);
});
//Crée une nouvelle éxécution
app.post('/execute', function(req, res) {
    execute.addExecute(req,res);
});

//Supprime l'éxécution selon son Id
app.delete('/execute/:uId/:tId/:cId', function (req, res) {
    execute.removeExecute(req,res);
});
//modifie l'éxécution selon son id
app.put('/execute/:uId/:tId/:cId',function (req,res) {
    execute.updateExecute(req,res);
});

//affiche un test particulier
app.get('/execute/:uId/:tId/:cId', function(req, res) {
    execute.getExecuteById(req,res);
});
//--------------------Version --------------------------------------------------
app.get('/version', function(req, res) {
    version.getAllVersion(req,res);
});
//Crée une nouvelle éxécution
app.post('/version', function(req, res) {
    version.addVersion(req,res);
});

//Supprime l'éxécution selon son Id
app.delete('/version/:sId/:rId/:vId', function (req, res) {
    version.removeVersion(req,res);
});
//modifie l'éxécution selon son id
app.put('/version/:sId/:rId/:vId',function (req,res) {
    version.updateVersion(req,res);
});

//affiche un test particulier
app.get('/version/:sId/:rId/:vId', function(req, res) {
    version.getVersionById(req,res);
});
//--------------------Test_Category --------------------------------------------------
app.get('/test_category', function(req, res) {
    test_category.getAllTestCategory();
});
//Crée une nouvelle categorie de test
app.post('/test_category', function(req, res) {
    test_category.addTestCategory()
});

//Supprime la catégorie de test selon son Id
app.delete('/test_category/:catId', function (req, res) {
    test_category.removeTestCategory()
});
//modifie la categorie de Test selon son id
app.put('/test_category/:catId',function (req,res) {
    test_category.updateTestCategory();
});

//affiche une categorie de test particulier
app.get('/test_category/:catId', function(req, res) {
    test_category.getTestCategoryById();
});
//--------------------Test_Analyze --------------------------------------------------
app.get('/analyze', function(req, res) {
    analyze.getAllAnalyze();
});
//Crée une nouvelle categorie de test
app.post('/analyze', function(req, res) {
    analyze.addAnalyze();
});

//Supprime la catégorie de test selon son Id
app.delete('/analyze/:issId/:tId/:uId', function (req, res) {
    analyze.removeAnalyze();
});
//modifie la categorie de Test selon son id
app.put('/analyze/:issId/:tId/:uId',function (req,res) {
    analyze.updateAnalyze();
});

//affiche une categorie de test particulier
app.get('/analyze/:issId/:tId/:uId', function(req, res) {
    analyze.getAnalyzeById();
});

//app.use(express.static('forms'));
app.use(express.static('public'));
app.use(function(req, res, next){
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(404).send('Lieu inconnu : '+req.originalUrl);
});
app.listen(8080);