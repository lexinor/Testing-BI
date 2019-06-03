let express = require('express');
let cookieParser = require('cookie-parser');
let session = require('express-session');

let bodyParser = require('body-parser');
let mysql = require('mysql');
let pug = require('pug');
let cors = require('cors');
let jwt = require('jsonwebtoken');

// Session handling


// Calling custom modules
let tester = require('./testers.js');
let tests = require('./tests.js');
let execute = require('./execute.js');
let test_category = require('./test_category.js');
//let test = require('./tests.js');
let version = require('./version.js');
let analyze = require('./analyze.js');
var app = express();

app.set('view engine', 'pug');


app.use(bodyParser.json()); // pour supporter json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); //  pour supporter  encoded url

app.use(cookieParser());
app.use(session({ secret: "toto", resave: false, saveUninitialized: false, cookie: { maxAge: 6000000} }));

let con = mysql.createConnection({
    host: "localhost",
    user: "nodeuser",
    password: "node",
    database: "db_testing",
    port: "8889"
});

let sess;

app.post('/login', (req,res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    sess = req.session;
    obj = JSON.parse(JSON.stringify(req.body, null, " "));

    sess.mail = obj.mail;
    if(sess.mail){
            let sql = mysql.format("SELECT * FROM tester WHERE uMail=? and uPassword=?",[obj.mail, obj.pass]);
            con.query(sql, function (err, rows, fields) {
                if (err) throw err;
                console.log(rows.length);
                if(rows.length > 0){
                    res.redirect('/panel');
                }
                else{
                    res.redirect('/');
                }
            });
    }
    else{
        console.log("Erreur de connexion");
        res.status(400).end('/aaaa');
    }
});



app.get('/panel', (req,res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    sess = req.session;
    if(sess.mail){
        res.status(200).render('index', { mail: sess.mail});
    }
    else
        res.redirect('/');
});

app.get('/panel', (req,res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    sess = req.session;
    if(sess.login){
        res.render('index');
    }
    else
        res.redirect('/');
});



// Homepage
app.get('/', function(req, res) {
    res.render('login');
});


app.get('/testers', function (req, res) {
    con.query('SELECT *  FROM tester ', (err, rows, fields) => {
        if (err) {
            return next(err);
        }
        console.log(fields);
        res.render('read_testers', { rows : rows});
    });
});

//-----------------------------------Fonctions Utilisateurs-------------------------------------------------------------
app.get('/addtester', function(req, res) {
res.render('add_tester')
});
// This method add a tester we need to send a JSON object with the user info to succeed
app.post('/tester', function(req, res) {
    obj = JSON.parse(JSON.stringify(req.body, null, " "));
    con.query("INSERT INTO tester (uLastName, uFirstName, uPassword, uMail) VALUES (?,?,?,?)",
        [obj.uLastName, obj.uFirstName, '1234', obj.uMail],
        function (err, result) {
        if (err) throw err;
        if(result.affectedRows > 0){
            console.log("1 record inserted");
            res.status(200).end("Okay");
        }
        else{
            console.log("No rows affected");
            res.status(403).end("Erreur");
        }
    });
    res.redirect('/testers');
});
// This method add a tester we need to send a JSON object with the user info to succeed
app.get('/tester/:id', function(req, res) {
    let uId = req.params.id;
    let sql = mysql.format("SELECT * FROM tester WHERE uId=?",uId);
    con.query(sql, function (err, rows, fields) {
        if (err) throw err;
        console.log(rows[0]);
        res.render('update_tester', { 'tester' : rows[0]  })

    });
});

app.post('/tester/updatetester', function(req, res) {
    obj = JSON.parse(JSON.stringify(req.body, null, " "));
    let sql = mysql.format("UPDATE tester SET uLastName=?, uFirstName=?, uMail=? WHERE uId=?",
        [obj.uLastName, obj.uFirstName,  obj.uMail,obj.id]);
    con.query(sql,function (err, result) {
        if(err) throw err;
        res.status(200).end("Nombre de lignes modifiés: " + result.affectedRows);
    });
    res.redirect('/testers');
});

// This method add a tester we need to send a JSON object with the user info to succeed
app.post('/testers', function(req, res) {
    tester.addUser(req,res);
});

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


app.get('/softwares', function (req, res) {
    con.query('SELECT *  FROM software ', (err, rows, fields) => {
        if (err) {
            return next(err);
        }
        console.log(fields);
        res.render('read_software', { rows : rows});
    });
});

app.get('/tests', function (req, res) {
    console.log('oui');
    con.query('SELECT *  FROM Test ', (err, rows, fields) => {
        if (err) {
            return next(err);
        }
        res.render('read_test', { rows : rows });
    });
});

app.get('/addsoftware', function(req, res) {
    res.render('add_software')
});
app.post('/software', function(req, res) {
    obj = JSON.parse(JSON.stringify(req.body, null, " "));
    con.query("INSERT INTO software (sName, sDescription, sEntryDate) VALUES (?,?,?)",
        [obj.name, obj.description, obj.startDate ],
        function (err, result) {
            if (err) throw err;
            if(result.affectedRows > 0){
                console.log("1 record inserted");
                res.status(200).end("Okay");
            }
            else{
                console.log("No rows affected");
                res.status(403).end("Erreur");
            }
        });
    res.redirect('/testers');
});

//app.use(express.static('forms'));
app.use(express.static('public'));
app.use(function(req, res, next){
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(404).send('Lieu inconnu : '+req.originalUrl);
});
app.listen(8080);