//-----------------------------------Fonctions Execute -------------------------------------------------------------
//Récupère toutes les éxécutions de test par un testeur
let getAllExecute = (req,res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM execute", function (err, rows, fields) {
            if (err) throw err;
            console.log(rows);
            res.json(rows);
        });
    });
}


//Crée une nouvelle éxécution
let addExecute = (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    obj = JSON.parse(JSON.stringify(req.body, null, " "));
    con.connect(function(err) {
        console.log(obj);
        if (err) throw err;
        var sql = mysql.format("INSERT INTO execute (uId, tId, cId, statut, startDate, endDate) " +
            "VALUES (?,?,?,?,?,?);", [obj.uId, obj.tId, obj.cId, obj.statut, obj.startDate,obj.endDate]);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    });
    res.status(200).end('Execution créée' );
};

//Supprime l'éxécution selon son Id
let deleteExecute = (req, res) => {
    res.setHeader("Content-Type","application/json; charset=utf8");
    con.connect(function (err) {
        if(err) throw err;

        let sql = mysql.format("DELETE FROM Execute WHERE uId = ? and tId = ? and cId = ? ; ", [req.params.uId,
            req.params.tId,
            req.params.cId]);

        con.query(sql,function (err, result,fields) {
            if(err) throw err;
            res.status(200).end("Nombre de lignes supprimée : " + result.affectedRows);
        });
    });
};
//modifie l'éxécution selon son id
let updateExecute = (req,res) => {
    res.setHeader("Content-Type","application/json; charset=utf8");
    obj = JSON.parse(JSON.stringify(req.body,null," "));
    con.connect(function (err) {
        if(err) throw  err;
        console.log(obj);
        let sql = mysql.format("UPDATE Execute SET statut = ?, startDate = ?, endDate = ? where uId = ? and tId = ? and cId = ?",
            [obj.statut,
                obj.startDate, obj.endDate, req.params.uId,req.params.tId,req.params.cId]);
        console.log(sql);
        con.query(sql,function (err, result) {
            if(err) throw err;
            res.status(200).end("Nombre de lignes modifiés: " + result.affectedRows);
        })
    })
};

//affiche un test particulier
let getExecuteById = (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    con.connect(function(err) {
        if (err) throw err;
        let sql = mysql.format("SELECT * FROM Execute WHERE uId=? and tId = ? and cId = ? ", [req.params.uId,
            req.params.tId,
            req.params.cId]);
        con.query(sql, function (err, rows, fields) {
            if (err) throw err;
            console.log(rows);
            res.json(rows);
        });
    });
};

exports.getAllExecute = getAllExecute;
exports.addExecute = addExecute;
exports.deleteExecute =deleteExecute;
exports.updateExecute = updateExecute;
exports.getExecuteById = getExecuteById;