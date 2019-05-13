//-----------------------------------Fonctions campaignTest -------------------------------------------------------------
//Récupère toutes les éxécutions de test par un testeur
app.get('/Software_Release', function(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM Software", function (err, rows, fields) {
            if (err) throw err;
            console.log(rows);
            res.json(rows);
        });
    });
}   );
//Crée une nouvelle campaignTest
app.post('/Software_Release', function(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    obj = JSON.parse(JSON.stringify(req.body, null, " "));
    con.connect(function(err) {
        console.log(obj);
        if (err) throw err;
        var sql = mysql.format("INSERT INTO Software_Release (sEntryDate, sName, sDescription) " +
            "VALUES (?,?,?);", [obj.sEntryDate, obj.sName, obj.sDescription]);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    });
    res.status(200).end('Software_Release créée');
});
//Supprime l'campaignTest selon son Id
app.delete('/Software_Release/:sId/:rId', function (req, res) {
    res.setHeader("Content-Type","application/json; charset=utf8");
    con.connect(function (err) {
        if(err) throw err;

        let sql = mysql.format("DELETE FROM Software_Release WHERE sId = ? and rId = ? ; ", [req.params.sId]
        );
        con.query(sql,function (err, result,fields) {
            if(err) throw err;
            res.status(200).end("Nombre de lignes supprimée : " + result.affectedRows);
        });
    });
});
//modifie une campaignTest selon son id
app.put('/Software_Release/:sId/:rId',function (req,res) {
    res.setHeader("Content-Type","application/json; charset=utf8");
    obj = JSON.parse(JSON.stringify(req.body,null," "));
    con.connect(function (err) {
        if(err) throw  err;
        console.log(obj);
        let sql = mysql.format("UPDATE Software_Release SET rVersion = ? where sId = ? and rId = ?",
            [obj.rVersion, req.params.sId, req.params.rId]);
        con.query(sql,function (err, result) {
            if(err) throw err;
            res.status(200).end("Nombre de lignes modifiés: " + result.affectedRows);
        })
    })
});

//affiche un campaignTest particulier
app.get('/Software_Release/:sId/:rId', function(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    con.connect(function(err) {
        if (err) throw err;
        let sql = mysql.format("SELECT * FROM Software_Release WHERE sId = ? and rId = ? ", [req.params.sId, req.params.rId
        ]);
        con.query(sql, function (err, rows, fields) {
            if (err) throw err;
            console.log(rows);
            res.json(rows);
        });
    });
});
