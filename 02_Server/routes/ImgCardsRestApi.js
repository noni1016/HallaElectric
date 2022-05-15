// Rest Api
// Reference : https://velog.io/@smooth97/Node.js-Restful-API-wok2wqo7yu
//             https://syoung-journey.tistory.com/30

var express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var router = express.Router();
const conn = require('../config/database');

var maxId = -1;
var fileName = '';

if (maxId === -1) {
    maxId = -1;
    let sql = 'SELECT MAX(id) FROM imgcards';
    conn.query(sql, function (error, rows, fields) {
        if (!error) {
            var result = rows[0];
            maxId = result['MAX(id)'];
        } else {
            console.log('query error : ' + error);
            maxId = -1;
        }
    });
}



router.get('/ImgCards/', async function (req, res, next) {
    let sql = ``;
    // if(req.params.id) sql = `SELECT * FROM ImgCards WHERE id=${req.params.id}`;
    // else 
    sql = 'SELECT * FROM ImgCards ORDER BY id DESC';
    conn.query(sql, function (error, rows, fields) {
        if (!error) {
            // console.log(rows);
            res.send(rows);
        } else {
            console.log('query error : ' + error);
        }
    });
})

router.get('/ImgCards/:id', async function (req, res, next) {
    let sql = ``;
    sql = `SELECT * FROM ImgCards WHERE id=${req.params.id}`;
    conn.query(sql, function (error, rows, fields) {
        if (!error) {
            // console.log(rows);
            res.send(rows);
        } else {
            console.log('query error : ' + error);
        }
    });
})

router.post('/ImgCards', (req, res) => {
    console.log('request on');
    console.log(req.body);
    // date = getToday();
    let sql = ``;

    sql = `INSERT INTO ImgCards (title, img) VALUES ('${req.body.title}', '/Images/ImgCards/${fileName}')`;

    console.log(sql);

    conn.query(sql, function (error, rows, fields) {
        if (!error) {
            console.log(rows);
            res.send(true);
        } else {
            console.log('query error : ' + error);
        }
    });
});

const uploadPost = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/Images/ImgCards');
        },
        filename(req, file, cb) {
            maxId += 1;
            var temp = file.originalname.split('.');
            var fileExt = temp[temp.length - 1];
            fileName = 'Id' + maxId + '.' + fileExt;
            cb(null, fileName);
        },
    }),
    // limits: { fileSize: 5 * 1024 * 1024 },
})

router.post('/ImgCards/img', uploadPost.single('file'), (req, res, next) => {
    console.log(req.file.filename);
    res.send(true);
})

// ImgCard Delete
router.delete('/ImgCards/:id/:imgSrc', (req, res) => {
    console.log('delete req in');
    console.log(req.params.imgSrc);
    console.log(req.params.id);
    fs.unlink(`./public/Images/ImgCards/${req.params.imgSrc}`, (err) => {
        err ? console.log(req.params.imgSrc) : console.log(`${req.params.imgSrc}를 정상적으로 삭제했습니다`);
      })
    
      let sql = `DELETE FROM imgcards WHERE imgcards.id=${req.params.id}`;
      console.log(sql);
      conn.query(sql, function (error, rows, fields) {
        if (!error) {
          console.log(rows);
          res.send({result: true});
          maxId -= 1;
        } else {
          console.log('query error : ' + error);
          res.send({result: false});
        }
      });
});

// ImgCard Update - Title
router.put('/ImgCards/:id', (req, res) => {
    // console.log('request on');
    // console.log(`id : ${req.params.id} body : ${req.body}`);
    let sql = ``;

    sql = `UPDATE ImgCards SET title = '${req.body.title}' WHERE id=${req.params.id}`;

    // console.log(sql);

    conn.query(sql, function (error, rows, fields) {
        if (!error) {
            console.log(rows);
            res.send(true);
        } else {
            console.log('query error : ' + error);
        }
    });
})

const uploadPut = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/Images/ImgCards');
        },
        filename(req, file, cb) {
            var temp = file.originalname.split('.');
            var fileExt = temp[temp.length - 1];
            fileName = 'Id' + req.params.id + '.' + fileExt;
            cb(null, fileName);
        },
    }),
    // limits: { fileSize: 5 * 1024 * 1024 },
})

// ImgCard Update - Img
router.put('/ImgCards/:id/:imgSrc', uploadPut.single('file'), (req, res) => {
    // console.log('request on');
    // console.log(`id : ${req.params.id} imgSrc : ${req.params.imgSrc}`);
    res.send(true);
})

module.exports = router;