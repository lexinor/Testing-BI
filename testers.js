var mysql = require('mysql');

let con = mysql.createConnection({
    host: "localhost",
    user: "nodeuser",
    password: "node",
    database: "db_testing"
});

var getUsers = (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM tester", function (err, rows, fields) {
            if (err) throw err;
            console.log(rows);
            res.json(rows);
        });
    });
}

var addUser = (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    obj = JSON.parse(JSON.stringify(req.body, null, " "));
    con.connect(function(err) {
        console.log(obj);
        if (err) throw err;
        var sql = mysql.format("INSERT INTO tester (uLastName, uFirstName, uPassword, uMail) VALUES (?,?,?,?);", [obj.lastName, obj.firstName, obj.pass, obj.mail]);
        con.query(sql, function (err, result) {
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
    });
    //res.status(200).end('Testeur créé');
}


let removeUser = (req,res) => {
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
}

let editUser = (req,res) => {
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
}

let getUserById = (req,res) => {
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
}

exports.getUserById = getUserById;
exports.editUser = editUser;
exports.removeUser = removeUser;
exports.addUser = addUser;
exports.getUsers = getUsers;