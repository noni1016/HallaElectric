var express = require('express');
var router = express.Router();
const multer = require('multer');
const conn = require('../config/database');

router.get('/Intro', async function (req, res, next) {
    let sql = ``;
    sql = `SELECT * FROM Intro`;
    console.log(sql);
    conn.query(sql, function (error, rows, fields) {
        if (!error) {
            res.send(rows);
        } else {
            console.log('query error : ' + error);
        }
    });
});

router.get('/Intro/:id', async function (req, res, next) {
    let sql = ``;
    let id = req.params.id;

    sql = `SELECT * FROM Intro WHERE id=${id}`;
    console.log(sql);
    conn.query(sql, function (error, rows, fields) {
        if (!error) {
            res.send(rows);
        } else {
            console.log('query error : ' + error);
        }
    });
});

router.post('/Intro', (req, res, next) => {
    let sql = ``;
    let data = req.body;
    console.log(req.body);
    let dataStr = 'NULL,'; // Auto Increase
    for (let key in data) {
        dataStr += `"${data[key]}",`
    }
    dataStr = dataStr.slice(0, -1);

    sql = `INSERT INTO Intro VALUES(${dataStr})`;
    console.log(sql);
    conn.query(sql, function (error, rows, fields) {
        if (!error) {
            console.log(rows);
            res.send(true);
        } else {
            console.log('query error : ' + error);
        }
    });
})

router.delete('/Intro/:id', (req, res, next) => {
    let sql = ``;
    let id = req.params.id;

    sql = `DELETE FROM Intro WHERE id=${id}`;
    console.log(sql);
    conn.query(sql, function (error, rows, fields) {
        if (!error) {
            res.send(true);
        } else {
            console.log('query error : ' + error);
        }
    });
})

router.put('/Intro/:id', (req, res, next) => {
    let sql = ``;
    let id = req.params.id;
    let data = req.body;
    let dataStr = '';
    for (let key in data) {
        dataStr += `${key}="${data[key]}",`
    }
    dataStr = dataStr.slice(0, -1);

    sql = `UPDATE Intro SET ${dataStr} WHERE id=${id}`;
    console.log(sql);
    conn.query(sql, function (error, rows, fields) {
        if (!error) {
            console.log(rows);
            res.send(true);
        } else {
            console.log('query error : ' + error);
        }
    });
})

const uploadPost = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/Images/Intro');
        },
        filename(req, file, cb) {
            var filename = file.originalname;
            var fileExt = file.mimetype.replace('image/' ,'');
            if (filename.lastIndexOf('.') != -1) { filename = filename.slice(0, filename.lastIndexOf('.')); }
            if (fileExt == 'jpeg') { fileExt = 'jpg'; }
            cb(null, filename + '.' + fileExt);
        },
    }),
})

router.post('/Intro/img', uploadPost.single('file'), (req, res, next) => {
    var file = req.file;
    var fileExt = file.mimetype.replace('image/' ,'');
    if (fileExt == 'jpeg') { fileExt = 'jpg'; }
    var name = file.destination.replace('public/', '') + '/' + file.filename;
    res.json(name);
})

module.exports = router;