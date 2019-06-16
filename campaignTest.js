//-----------------------------------Fonctions campaignTest -------------------------------------------------------------
//Récupère toutes les éxécutions de test par un testeur
app.get('/campaignTest', function(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    con.query("SELECT * FROM CampaignTest", function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
        res.json(rows);
    });
});



//Crée une nouvelle campaignTest
app.post('/campaignTest', function(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    obj = JSON.parse(JSON.stringify(req.body, null, " "));
    var sql = mysql.format("INSERT INTO campaignTest (cId, cDescription, duration, sId, rId, vId) " +
        "VALUES (?,?,?,?,?,?);", [obj.cId, obj.cDescription, obj.duration, obj.sId, obj.rId,obj.vId]);
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
    res.status(200).end('campaignTest créée' );
});

//Supprime l'campaignTest selon son Id
app.delete('/campaignTest/:cId', function (req, res) {
    res.setHeader("Content-Type","application/json; charset=utf8");
    let sql = mysql.format("DELETE FROM campaignTest WHERE cId = ? ; ", [req.params.cId] );
    con.query(sql,function (err, result,fields) {
        if(err) throw err;
        res.status(200).end("Nombre de lignes supprimée : " + result.affectedRows);
    });
});
//modifie l'campaignTest selon son id
app.put('/campaignTest/:cId',function (req,res) {
    res.setHeader("Content-Type","application/json; charset=utf8");
    obj = JSON.parse(JSON.stringify(req.body,null," "));
    let sql = mysql.format("UPDATE CampaignTest SET cDescription = ?, duration = ?, sId = ?, rId = ?, vId = ?" +
        " where cId = ?",
        [obj.cDescription,
            obj.duration, obj.sId, obj.rId,obj.vId, req.params.cId]);
    console.log(sql);
    con.query(sql,function (err, result) {
        if(err) throw err;
        res.status(200).end("Nombre de lignes modifiés: " + result.affectedRows);
    });
});

//affiche un campaignTest particulier
app.get('/campaignTest/:cId', function(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    let sql = mysql.format("SELECT * FROM CampaignTest WHERE cId=? ", [req.params.cId
    ]);
    con.query(sql, function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
        res.json(rows);
    });
});
