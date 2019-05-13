var mysql = require('mysql');

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "db_testing",
    port: "8889"
});
//-----------------------------------Fonctions Version -------------------------------------------------------------
//Récupère toutes les éxécutions de test par un testeur
let getAllVersion = (req,res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM Version", function (err, rows, fields) {
            if (err) throw err;
            res.json(rows);
        });
    });
};


//Crée une nouvelle éxécution
let addVersion = (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    obj = JSON.parse(JSON.stringify(req.body, null, " "));
    con.connect(function(err) {
        console.log(obj);
        if (err) throw err;
        var sql = mysql.format("INSERT INTO Version (sId, rId, vId, vLabel, vDescription) " +
            "VALUES (?,?,?,?,?);", [obj.sId, obj.rId, obj.vId, obj.vLabel, obj.vDescription]);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    });
    res.status(200).end('Execution créée' );
};

//Supprime l'éxécution selon son Id
let removeVersion = (req, res) => {
    res.setHeader("Content-Type","application/json; charset=utf8");
    con.connect(function (err) {
        if(err) throw err;

        let sql = mysql.format("DELETE FROM Version WHERE sId = ? and rId = ? and vId = ? ; ", [req.params.sId,
            req.params.rId,
            req.params.vId]);
        con.query(sql,function (err, result,fields) {
            if(err) throw err;
            res.status(200).end("Nombre de lignes supprimée : " + result.affectedRows);
        });
    });
};
//modifie l'éxécution selon son id
let updateVersion = (req,res) => {
    res.setHeader("Content-Type","application/json; charset=utf8");
    obj = JSON.parse(JSON.stringify(req.body,null," "));
    con.connect(function (err) {
        if(err) throw  err;
        console.log(obj);
        let sql = mysql.format("UPDATE Version SET vLabel = ?, vDescription = ?, sId = ?, rId = ?,  vId = ?" +
            " where sId = ? and rId = ? and vId = ?",
            [obj.vLabel,
                obj.vDescription, obj.sId,obj.rId, obj.sId, req.params.sId,req.params.rId,req.params.vId]);
        con.query(sql,function (err, result) {
            if(err) throw err;
            res.status(200).end("Nombre de lignes modifiés: " + result.affectedRows);
        })
    })
};

//affiche un test particulier
let getVersionById = (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    con.connect(function(err) {
        if (err) throw err;
        let sql = mysql.format("SELECT * FROM Version WHERE sId=? and rId = ? and vId = ? ", [req.params.sId,
            req.params.rId,
            req.params.vId]);
        con.query(sql, function (err, rows, fields) {
            if (err) throw err;
            console.log(rows);
            res.json(rows);
        });
    });
};

exports.getAllVersion = getAllVersion;
exports.addVersion = addVersion;
exports.removeVersion = removeVersion;
exports.updateVersion = updateVersion;
exports.getVersionById = getVersionById;