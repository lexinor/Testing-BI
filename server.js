var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cors = require('cors');
var jwt = require('jsonwebtoken');

var app = express();
app.use(bodyParser.json()); // pour supporter json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); //  pour supporter  encoded url

let con = mysql.createConnection({
    host: "localhost",
    user: "mya",
    password: "jesuiscertain",
    database: "db_testing",
    port: "8889"
});

app.get('/', function(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.send('Bonjour');
});

app.get('/private', function(req, res) {
    res.sendFile( __dirname + "/private/" + "chatmyope.jpg" );
});

app.post('/users', function(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    obj = JSON.parse(JSON.stringify(req.body, null, " "));
    var con = mysql.createConnection({
        host: "localhost",
        user: "nodeuser",
        password: "node",
        database: "LicencePro"
    });
    con.connect(function(err) {
        if (err) throw err;
        var sql = mysql.format("INSERT INTO user (nom, prenom,password,last_token) VALUES (?,?,?);", [obj.nom, obj.prenom,obj.password]);
        con.query(sql, function (err, result) {
            console.log(obj.nom);
            if (err) throw err;
            console.log("1 record inserted");
        });
    });
    res.status(200).end('Contact créé' );
});
//-----------------------------------Fonctions Utilisateurs-------------------------------------------------------------
//Récupère tous les Testeurs
app.get('/testers', function(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    con.connect(function(err) {
        if (err) throw err;
            con.query("SELECT * FROM tester", function (err, rows, fields) {
                if (err) throw err;
                console.log(rows);
                res.json(rows);
            });
    });
}   );
//Crée un nouveau Testeur
app.post('/testers', function(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    obj = JSON.parse(JSON.stringify(req.body, null, " "));
    con.connect(function(err) {
        console.log(obj);
        if (err) throw err;
        var sql = mysql.format("INSERT INTO tester (uLastName, uFirstName, uPassword, uMail) VALUES (?,?,?,?);", [obj.lastName, obj.firstName, obj.pass, obj.mail]);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    });
    res.status(200).end('Testeur créé' );
});

app.delete('/testers/:uId', function (req, res) {
    res.setHeader("Content-Type","application/json; charset=utf8");
    let id = req.params.uId;
    con.connect(function (err) {
        if(err) throw err;
        let sql = mysql.format("DELETE FROM tester WHERE uId = ?",id);

        con.query(sql,function (err, result,fields) {
            if(err) throw err;
            res.status(200).end("Nombre de lignes supprimée : " + result.affectedRows);
        });
    });
});

app.put('/testers/:uId',function (req,res) {
    res.setHeader("Content-Type","application/json; charset=utf8");
    obj = JSON.parse(JSON.stringify(req.body,null," "));
    let id = req.params.uId;

    con.connect(function (err) {
        if(err) throw  err;
        console.log(id);
        console.log(obj);
        let sql = mysql.format("UPDATE tester SET uLastName=?, uFirstName=?, uMail=? WHERE uId=?",[obj.lastName, obj.firstName,  obj.mail,id]);
        con.query(sql,function (err, result) {
            if(err) throw err;
            res.status(200).end("Nombre de lignes modifiés: " + result.affectedRows);
        })
    })
})


app.get('/testers/:uId', function(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    con.connect(function(err) {
        if (err) throw err;
        let uId = req.params.uId;
        let sql = mysql.format("SELECT * FROM tester WHERE uId=?",uId);
        con.query(sql, function (err, rows, fields) {
            if (err) throw err;
            console.log(rows);
            res.json(rows);
        });
    });
});


//-----------------------------------Fonctions Test -------------------------------------------------------------
//Récupère tous les Testeurs
app.get('/tests', function(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM test", function (err, rows, fields) {
            if (err) throw err;
            console.log(rows);
            res.json(rows);
        });
    });
}   );
//Crée un nouveau Testeur
app.post('/tests', function(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    obj = JSON.parse(JSON.stringify(req.body, null, " "));
    con.connect(function(err) {
        console.log(obj);
        if (err) throw err;
        var sql = mysql.format("INSERT INTO test (tDescription, tdateCreation, duration, catId) VALUES (?,?,?,?);", [obj.description, obj.dateCreation, obj.duration, obj.catId]);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    });
    res.status(200).end('Test créé' );
});
//Supprime le test selon son id et les lignes le concernant en pariticiper, en test
app.delete('/tests/:tId', function (req, res) {
    res.setHeader("Content-Type","application/json; charset=utf8");
    let id = req.params.tId;
    con.connect(function (err) {
        if(err) throw err;
        let sql3 = mysql.format("DELETE FROM participer WHERE tId = ?",id);
        let sql2 = mysql.format("DELETE FROM test WHERE tId = ?",id);
        let sql = mysql.format("DELETE FROM Analyse WHERE tId = ? ", id);

        con.query(sql,function (err, result,fields) {
            if(err) throw err;
            console.log(result.affectedRows);
        });
        con.query(sql3,function (err, result,fields) {
            if(err) throw err;
            console.log(result.affectedRows);
        });
        con.query(sql2,function (err, result,fields) {
            if(err) throw err;
            res.status(200).end("Nombre de lignes supprimée : " + result.affectedRows);
        });

    });
});
//modifie le test selon son id
app.put('/tests/:uId',function (req,res) {
    res.setHeader("Content-Type","application/json; charset=utf8");
    obj = JSON.parse(JSON.stringify(req.body,null," "));
    let id = req.params.uId;

    con.connect(function (err) {
        if(err) throw  err;
        console.log(id);
        console.log(obj);
        let sql = mysql.format("UPDATE test SET tDescription = ?, tdateCreation = ?, duration = ?, catId = ? WHERE tId = ?",[obj.description, obj.dateCreation,
            obj.duration, obj.catId, id]);
        con.query(sql,function (err, result) {
            if(err) throw err;
            res.status(200).end("Nombre de lignes modifiés: " + result.affectedRows);
        })
    })
});

//affiche un test particulier
app.get('/tests/:tId', function(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    con.connect(function(err) {
        if (err) throw err;
        let Id = req.params.tId;
        let sql = mysql.format("SELECT * FROM test WHERE tId=?",Id);
        con.query(sql, function (err, rows, fields) {
            if (err) throw err;
            console.log(rows);
            res.json(rows);
        });
    });
});






//app.use(express.static('forms'));
app.use('/static', express.static('public'));
app.use(function(req, res, next){
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(404).send('Lieu inconnu : '+req.originalUrl);
});
app.listen(8080);