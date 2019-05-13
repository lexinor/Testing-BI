var mysql = require('mysql');

let con = mysql.createConnection({
    host: "localhost",
    user: "nodeuser",
    password: "node",
    database: "db_testing"
});

//Récupère tous les Testeurs
let getAllTests = (req,res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM test", function (err, rows, fields) {
            if (err) throw err;
            console.log(rows);
            res.json(rows);
        });
    });
}

//Crée un nouveau Test
let createTest = (req,res) => {
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
}

//Supprime le test selon son id et les lignes le concernant en pariticiper, en test
let removeTestById = (req,res) => {
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
}

//modifie le test selon son id
let editTestById = (req,res) => {
    res.setHeader("Content-Type","application/json; charset=utf8");
    obj = JSON.parse(JSON.stringify(req.body,null," "));
    let id = req.params.tId;

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
}

//affiche un test particulier
let getTestById = (req,res) => {
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
}

exports.getAllTests = getAllTests;
exports.createTest = createTest;
exports.getTestById = getTestById;
exports.editTestById = editTestById;
exports.removeTestById = removeTestById;