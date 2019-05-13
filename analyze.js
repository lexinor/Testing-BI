var mysql = require('mysql');

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "db_testing",
    port: "8889"
});
//-----------------------------------Fonctions Analyze -------------------------------------------------------------
//Récupère toutes les éxécutions de test par un testeur
let getAllAnalyze = (req,res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM Analyze", function (err, rows, fields) {
            if (err) throw err;
            res.json(rows);
        });
    });
};


//Crée une nouvelle éxécution
let addAnalyze = (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    obj = JSON.parse(JSON.stringify(req.body, null, " "));
    con.connect(function(err) {
        console.log(obj);
        if (err) throw err;
        var sql = mysql.format("INSERT INTO Analyze (issId, tId, uId, statut, startDate, endDate) " +
            "VALUES (?,?,?,?,?,?);", [obj.issId, obj.tId, obj.uId, obj.statut, obj.startDate, obj.endDate]);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    });
    res.status(200).end('Execution créée' );
};

//Supprime l'éxécution selon son Id
let removeAnalyze = (req, res) => {
    res.setHeader("Content-Type","application/json; charset=utf8");
    con.connect(function (err) {
        if(err) throw err;

        let sql = mysql.format("DELETE FROM Analyze WHERE issId = ? and tId = ? and uId = ? ; ", [req.params.issId,
            req.params.tId,
            req.params.uId]);
        con.query(sql,function (err, result,fields) {
            if(err) throw err;
            res.status(200).end("Nombre de lignes supprimée : " + result.affectedRows);
        });
    });
};
//modifie l'éxécution selon son id
let updateAnalyze = (req,res) => {
    res.setHeader("Content-Type","application/json; charset=utf8");
    obj = JSON.parse(JSON.stringify(req.body,null," "));
    con.connect(function (err) {
        if(err) throw  err;
        console.log(obj);
        let sql = mysql.format("UPDATE Analyze SET statut = ?, startDate = ?, endDate = ?, issId = ?,  tId = ?" +
            " WHERE issId = ? and tId = ? and uId = ?",
            [obj.vLabel,
                obj.vDescription, obj.sId,obj.rId, obj.sId, req.params.issId,
                req.params.tId,
                req.params.uId]);
        con.query(sql,function (err, result) {
            if(err) throw err;
            res.status(200).end("Nombre de lignes modifiés: " + result.affectedRows);
        })
    })
};

//affiche un test particulier
let getAnalyzeById = (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    con.connect(function(err) {
        if (err) throw err;
        let sql = mysql.format("SELECT * FROM Analyze WHERE issId = ? and tId = ? and uId = ? ", [req.params.issId,
            req.params.tId,
            req.params.uId]);
        con.query(sql, function (err, rows, fields) {
            if (err) throw err;
            console.log(rows);
            res.json(rows);
        });
    });
};

exports.getAllAnalyze = getAllAnalyze;
exports.addAnalyze = addAnalyze;
exports.removeAnalyze = removeAnalyze;
exports.updateAnalyze = updateAnalyze;
exports.getAnalyzeById = getAnalyzeById;