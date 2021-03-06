const mysql = require('mysql');
let con = mysql.createConnection({
    host: "localhost",
    user: "nodeuser",
    password: "node",
    database:"db_testing"
    //port : 8889 // to comment when using WINDOWS
});


let getAllTestCategory = (req,res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    con.query("SELECT * FROM test_category", function (err, rows, fields) {
        if (err) throw err;
        res.json(rows).end();
    });
};
//Crée une nouvelle éxécution
let addTestCategory = (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    obj = JSON.parse(JSON.stringify(req.body, null, " "));
    con.connect(function(err) {
        console.log(obj);
        if (err) throw err;
        var sql = mysql.format("INSERT INTO test_category (catId, catLabel) " +
            "VALUES (?,?);", [obj.catId, obj.catLabel]);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    });
    res.status(200).end('Execution créée' );
};

//Supprime l'éxécution selon son Id
let removeTestCategory = (req, res) => {
    res.setHeader("Content-Type","application/json; charset=utf8");
    con.connect(function (err) {
        if(err) throw err;

        let sql = mysql.format("DELETE FROM test_category WHERE catId = ? ; ", [req.params.catId,
            ]);

        con.query(sql,function (err, result,fields) {
            if(err) throw err;
            res.status(200).end("Nombre de lignes supprimée : " + result.affectedRows);
        });
    });
};
//modifie l'éxécution selon son id
let updateTestCategory = (req,res) => {
    res.setHeader("Content-Type","application/json; charset=utf8");
    obj = JSON.parse(JSON.stringify(req.body,null," "));
    con.connect(function (err) {
        if(err) throw  err;
        console.log(obj);
        let sql = mysql.format("UPDATE test_category SET catLabel = ?", // à faire
            [obj.catLabel,
                req.params.catId]);
        console.log(sql);
        con.query(sql,function (err, result) {
            if(err) throw err;
            res.status(200).end("Nombre de lignes modifiés: " + result.affectedRows);
        })
    })
};

//affiche une categorie de test particuliere
let getTestCategoryById = (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    con.connect(function(err) {
        if (err) throw err;
        let sql = mysql.format("SELECT * FROM test_category WHERE catId=?", [req.params.catId,
            ]);
        con.query(sql, function (err, rows, fields) {
            if (err) throw err;
            console.log(rows);
            res.json(rows);
        });
    });
};

exports.getAllTestCategory = getAllTestCategory;
exports.addTestCategory = addTestCategory;
exports.removeTestCategory =removeTestCategory;
exports.updateTestCategory = updateTestCategory;
exports.getTestCategoryById = getTestCategoryById;