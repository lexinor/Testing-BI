const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const bodyParser = require('body-parser');
const mysql = require('mysql');
const pug = require('pug');
const request = require('request');

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
app.use(session({ secret: "toto", resave: false, saveUninitialized: false, cookie: { maxAge: 900000} }));

let con = mysql.createConnection({
    host: "localhost",
    user: "nodeuser",
    password: "node",
    database:"db_testing"
    //port : 8889 // to comment when using WINDOWS
});

let sess;

// -------- LOGIN-IN -------- //

app.post('/login', function(req, res) {
    res.set("Content-Type", "application/json; charset=utf-8");
    obj = JSON.parse(JSON.stringify(req.body,null," "));

    let sql = mysql.format("SELECT * FROM tester WHERE uMail=? and uPassword=?",[obj.mail, obj.pass]);
    con.query(sql, function (err, rows, fields) {
        if (err) throw err;
        if(rows.length > 0){

            let uId = rows[0].uId;
            let rank = rows[0].rank;
            let mail = obj.mail;

            if(uId != null){
                req.session.mail = mail;
                req.session.userId = uId;
                req.session.rank = rank;
                res.redirect('/dashboard')
            }
            else{
                res.redirect('/');
            }
        }
        else{
            console.log("No account found");
            res.redirect('/');
        }
    });
});

app.get('/destroy', (req, res) => {
    if(req.session){
        req.session.destroy((err) => {
            console.log('Session destroyed');
            res.redirect('/');
        })
    }
    else{
        console.log('No session detected');
        res.redirect('/login');
    }
});

app.get('/dashboard', (req, res) => {
    sess = req.session;
    if(sess.mail){
        res.render('dashboard', { mail: sess.mail, pagename: "Dashboard", rank: sess.rank } );
    }else{
        res.redirect('/');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
})

// Homepage
app.get('/', function(req, res) {
    sess = req.session;
    if(sess.mail)
        res.redirect('/dashboard');
    else
        res.render('login');
});


app.get('/testers', function (req, res) {
    sess =  req.session;
    if(sess.mail){
        con.query('SELECT *  FROM tester ', (err, rows, fields) => {
            if (err) throw err;
            console.log(fields);
            res.render('read_testers', { rows : rows, mail: sess.mail, pagename: "Testers Page" });
        });
    }
    else{
        res.redirect('/');
    }

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
});

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
});

// This method GET a specific tester using his ID
app.get('/testers/:uId', function(req, res) {
    tester.getUserById(req,res);});


//-----------------------------------Fonctions Test -------------------------------------------------------------

app.get('/addtestbycat', (req,res) => {
    let options = { url: 'http://localhost:8080/test_cats', headers: { } };

    // Starting request
    request(options,(err,response,body) => {
        if(err) throw err;
        let categories = JSON.parse(body);
        res.render('add_test_by_category', { pagename: "Saisie d'un test", categories: categories});

    });
});

app.post('/addtestbycat', (req,res) => {
    obj = JSON.parse(JSON.stringify(req.body, null, " "));

    let category = obj.cat;
    let description = obj.description;
    let dateCrea = obj.datecrea;
    let duration = obj.duration;

    let options = { url: 'http://localhost:8080/tests',
        form: {
            "description": description,
            "dateCreation": dateCrea,
            "duration": duration,
            "catId": category
        },
        headers: {'Content-Type': 'application/json' }
    };
    request.post(options, (err,httpResponse,body) => {

        res.redirect('/dashboard?ok');
    });

});

//Récupère tous les Tests
app.get('/tests', function(req, res) {
    tests.getAllTests(req,res);
});
//Crée un nouveau Test
app.post('/tests', function(req, res) {
    tests.createTest(req,res);
});

app.post('/tests', function(req, res) {
    tests.createTestByCat(req,res);
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
app.get('/test_categories', function(req, res) {
    con.query('SELECT *  FROM test_category ', (err, rows, fields) => {
        if (err) {
            throw err;
        }
        res.render('read_test_categories', { rows : rows});
    });
});

app.get('/test_cats', (req, res) => {
    test_category.getAllTestCategory(req,res);
});

//Crée une nouvelle categorie de test
app.post('/test_category', function(req, res) {
    test_category.addTestCategory(req,res)
});

//Supprime la catégorie de test selon son Id
app.delete('/test_category/:catId', function (req, res) {
    test_category.removeTestCategory(req,res)
});
//modifie la categorie de Test selon son id
app.put('/test_category/:catId',function (req,res) {
    test_category.updateTestCategory(req,res);
});

//affiche une categorie de test particulier
app.get('/test_category/:catId', function(req, res) {
    test_category.getTestCategoryById(req,res);
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
//CRUD CAMPAIGN TEST

app.get('/addcampaigntest', function(req, res) {
    let sql = mysql.format("select version.vId as vid, version.rId as rid, version.sId as sid, software.sName from version INNER JOIN software on software.sId = version.sId ");
    con.query(sql, function (err, rows, fields) {
        if (err) throw err;
        res.render('add_campaign_test', { softwares: rows});
    });
});
app.post('/campaigntest', function(req, res) {

    objReq = JSON.parse(JSON.stringify(req.body, null, " "));

   var x= objReq.software;
 //  var array = x.split(",");
 //var y = x.split(",");
    var obj = JSON.parse(x);
    var sid = (obj["sid"]);
    var rid = (obj["rid"]);
    var vid = (obj["vid"]);

    con.query("INSERT INTO campaigntest (cDescription, duration, sId, rId, vId)" +
        " VALUES (?,?,?,?,?)",
        [objReq.description, objReq.duration, sid, rid, vid],
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
    res.redirect('/campaignstests');
});

app.get('/campaignstests', function (req, res) {
    con.query('SELECT duration, cDescription, software.sName as softwareName, cId FROM campaigntest INNER JOIN' +
        ' software on software.sId = campaigntest.sId', (err, rows, fields) => {
        if (err) {
            throw err;
        }
        res.render('read_campaign_test', { rows : rows});
    });
});

app.get('/testssincecampaign/:id', function (req, res) {
    con.query('select * from test  INNER JOIN participer on participer.tId = test.tId ' +
        'INNER JOIN campaigntest on campaigntest.cId = participer.cId where campaigntest.cId = ?', [req.params.id],
        (err, rows, fields) => {
        if (err) {
            throw err;
        }
        res.render('read_tests_since_campaign', { rows : rows, pagename: 'Tests de la campagne'});
    });
});
app.get('/testdetails/:id', function (req, res) {
    con.query('select * from test inner JOIN execute on execute.tId = test.tId' +
        ' INNER join tester on tester.uId = execute.uId where test.tId = ?', [req.params.id],
        (err, rows, fields) => {
            if (err) {
                throw err;
            }
            res.render('read_test_details', { rows : rows, pagename: 'Testeurs du test'});
        });
});
app.get('/campaigntest/:id', function(req, res) {
    let id = req.params.id;
    let sql = mysql.format("SELECT * FROM campaigntest WHERE cId=?",id);
    con.query(sql, function (err, rows, fields) {
        if (err) throw err;
        res.render('update_campaign_test', { 'software' : rows[0]  })

    });
});

//CRUD version
//CRUD CAMPAIGN TEST

app.get('/addversion/:idSoftware/:idRelease', function(req, res) {
    res.render('add_version', {  idSoftware: req.params.idSoftware, idRelease: req.params.idRelease});
});
app.post('/version', function(req, res) {
    console.log("yes");
    obj = JSON.parse(JSON.stringify(req.body, null, " "));

    con.query("INSERT INTO version (sId, rId, vId, vLabel, vDescription)" +
        " VALUES (?,?,?,?,?)",
        [obj.idSoftware, obj.idRelease, obj.vId, obj.vLabel, obj.vDescription],
        function (err, result) {
            if (err) throw err;
            if(result.affectedRows > 0){
                console.log("1 record inserted");
                res.redirect('/versions/' + obj.idSoftware +"/" + obj.idRelease);
            }
            else{
                console.log("No rows affected");
                res.status(403).end("Erreur");
            }
        });
});

app.get('/versions/:idSoftware/:idRelease', function (req, res) {
    con.query('SELECT * from version where sId = ? and rId = ?', [req.params.idSoftware, req.params.idRelease]
        , (err, rows, fields) => {
            if (err) {
                throw err;
            }
            res.render('read_versions', {rows: rows, idSoftware: req.params.idSoftware, idRelease: req.params.idRelease});
        });
});



//CRUD CAMPAIGN TEST

app.get('/addsoftwarerelease/:id', function(req, res) {
        res.render('add_software_release', {  idSoftware: req.params.id});
});
app.post('/softwarerelease', function(req, res) {

    obj = JSON.parse(JSON.stringify(req.body, null, " "));

    con.query("INSERT INTO software_release (sId, rId, rVersion)" +
        " VALUES (?,?,?)",
        [obj.idSoftware, obj.idRelease, obj.release],
        function (err, result) {
            if (err) throw err;
            if(result.affectedRows > 0){
                console.log("1 record inserted");
                res.redirect('/softwarerelease/' + obj.idSoftware);
            }
            else{
                console.log("No rows affected");
                res.status(403).end("Erreur");
            }
        });
});

app.get('/softwarerelease/:id', function (req, res) {
    con.query('SELECT * from software_release where sId = ?', [req.params.id], (err, rows, fields) => {
        if (err) {
            throw err;
        }
        res.render('read_software_release', { rows : rows, idSoftware : req.params.id});
    });
});





//CRUD SOFTWARE
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
    res.redirect('/softwares');
});
app.get('/software/:id', function(req, res) {
    let id = req.params.id;
    let sql = mysql.format("SELECT * FROM software WHERE sId=?",id);
    con.query(sql, function (err, rows, fields) {
        if (err) throw err;
        res.render('update_software', { 'software' : rows[0]  })

    });
});
app.post('/software/updatesoftware', function(req, res) {
    obj = JSON.parse(JSON.stringify(req.body, null, " "));
    let sql = mysql.format("UPDATE software SET sName=?, sDescription=? WHERE sId=?",
        [obj.name, obj.description,obj.id]);
    con.query(sql,function (err, result) {
        if(err) throw err;
        res.status(200).end("Nombre de lignes modifiés: " + result.affectedRows);
    });
    res.redirect('/softwares');
});

app.get('/add_test_category', function(req, res) {
    res.render('add_test_category')
});
app.post('/test_category', function(req, res) {
    obj = JSON.parse(JSON.stringify(req.body, null, " "));
    con.query("INSERT INTO test_category (catLabel) VALUES (?)",
        [obj.label],
        function (err, result) {
            if (err) throw err;
            if(result.affectedRows > 0){
                console.log("1 record inserted");
                res.redirect('/test_categories');
            }
            else{
                console.log("No rows affected");
                res.status(403).end("Erreur");
            }
        });
});
//issue type


app.get('/add_issue_type', function(req, res) {
    res.render('add_issue_type');
});
app.post('/issue_type', function(req, res) {
    obj = JSON.parse(JSON.stringify(req.body, null, " "));
    con.query("INSERT INTO issue_type (itLabel) VALUES (?)",
        [obj.label],
        function (err, result) {
            if (err) throw err;
            if(result.affectedRows > 0){
                console.log("1 record inserted");
                res.redirect('/issues_types');
            }
            else{
                console.log("No rows affected");
                res.status(403).end("Erreur");
            }
        });
});
app.get('/issues_types', function(req, res) {
    con.query('SELECT *  FROM issue_type ', (err, rows, fields) => {
        if (err) {
            throw err;
        }
        res.render('read_issue_type', { rows : rows});
    });
});
//app.use(express.static('forms'));
app.use(express.static('public'));
app.use(function(req, res, next){
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(404).send('Lieu inconnu : '+req.originalUrl);
});
app.listen(8080);