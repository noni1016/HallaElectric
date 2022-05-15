// Rest Api
// Reference : https://velog.io/@smooth97/Node.js-Restful-API-wok2wqo7yu
//             https://syoung-journey.tistory.com/30

var express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const moment = require("moment");
var router = express.Router();
const conn = require('../config/database');
const { query } = require('express');

router.get('/Board/:boardType/ContentNum', function (req, res) {
    let sql = `SELECT COUNT(*) FROM board WHERE type=${req.params.boardType}`;
    console.log(sql);
    conn.query(sql, function (error, rows, fields) {
        if (!error) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log('query error : ' + error);
        }
    });
})

router.get('/Board/:boardType/:startIdx/:num', async function (req, res, next) {
    let sql = ``;
    sql = `SELECT * FROM board_vw WHERE type=${req.params.boardType} ORDER BY id DESC LIMIT ${req.params.startIdx}, ${req.params.num}`;
    console.log(sql);
    conn.query(sql, function (error, rows, fields) {
        if (!error) {
            // console.log(rows);
            res.send(rows);
        } else {
            console.log('query error : ' + error);
        }
    });
})

router.get('/Board/:id', async function (req, res, next) {
    let sql = ``;
    sql = `SELECT * FROM board_vw WHERE id=${req.params.id}`;
    console.log(sql);
    conn.query(sql, function (error, rows, fields) {
        if (!error) {
            // console.log(rows);
            res.send(rows);
        } else {
            console.log('query error : ' + error);
        }
    });
})


router.post('/Board', (req, res) => {
    console.log('request on');
    console.log(req.body);
    let sql = ``;

    sql = `INSERT INTO board (type, title, date, author, private, password, content) VALUES ('${req.body.boardType}', '${req.body.title}', '${req.body.date}', '${req.body.author}', '${req.body.private}', '${req.body.password}', '${req.body.content}')`;

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

// Board Delete
router.delete('/Board/:id', (req, res) => {
    console.log('delete req in');
    console.log(req.params.id);

    
      let sql = `DELETE FROM board WHERE id=${req.params.id}`;
      console.log(sql);
      conn.query(sql, function (error, rows, fields) {
        if (!error) {
          console.log(rows);
          res.send({result: true});
        } else {
          console.log('query error : ' + error);
          res.send({result: false});
        }
      });
});

// Board Update
router.put('/Board/:id', (req, res) => {
    console.log('request on');
    // console.log(`id : ${req.params.id} body : ${req.body}`);

    let sql = ``;
    sql = `UPDATE board SET title = '${req.body.title}', date = '${req.body.date}', author = '${req.body.author}', private = '${req.body.private}', password = '${req.body.password}', content = '${req.body.content}' WHERE id=${req.params.id}`;

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


// Get Comment
router.get('/Board/:boardId/Comments', function (req, res, next) {
    let sql = ``;
    sql = `SELECT * FROM Comment WHERE boardId=${req.params.boardId}`;
    console.log(sql);
    conn.query(sql, function (error, rows, fields) {
        if (!error) {
            // console.log(rows);
            res.send(rows);
        } else {
            console.log('query error : ' + error);
        }
    });
})


// Upload Comment
router.post('/Board/:boardId/Comment', async (req, res) => {
    let time = moment().format('YYYY.MM.DD HH:mm:ss');
    let sql1 = `INSERT INTO comment (boardId, author, password, content, time) VALUES ('${req.params.boardId}', '${req.body.author}', '${req.body.password}', '${req.body.content}', '${time}')`;
    // let sql2 = `SELECT COUNT(*) FROM Comment WHERE boardId=${req.params.boardId}`;
    // let sql3 = ``;
    let sql4 = `SELECT * FROM Comment WHERE boardId=${req.params.boardId}`;
    let cnt = 0;
    console.log(sql1);
    console.log(sql4);
    
    try {
        await conn.beginTransaction();
        await conn.query(sql1);
        // await conn.query(sql2, (error, rows) => {
            // let row = rows[0];
            // cnt = row['COUNT(*)'];       
            // console.log(cnt);     
            // sql3 = `UPDATE Board SET numComments = ${cnt} WHERE id = ${req.params.boardId}`;
            // console.log(sql3);
            // conn.query(sql3);
        // });
        await conn.query(sql4, async (error, rows) => {
            console.log(sql4);
            await conn.commit();
            res.send(rows);
        })
    } catch (err) {
        console.log(err)
        await conn.rollback()
        res.status(500).json(err)
    }
});

// Board Comment Delete
router.delete('/Board/:boardId/comment/:commentId', async (req, res) => {
    let sql1 = `DELETE FROM comment WHERE id=${req.params.commentId}`;
    // let sql2 = `SELECT COUNT(*) FROM Comment WHERE boardId=${req.params.boardId}`;
    // let sql3 = ``;
    let sql4 = `SELECT * FROM Comment WHERE boardId=${req.params.boardId}`;
    let cnt = 0;
    console.log(sql1);
    console.log(sql4);
    try {
        await conn.beginTransaction();
        await conn.query(sql1);
        // await conn.query(sql2, (error, rows) => {
        //     let row = rows[0];
        //     cnt = row['COUNT(*)'];       
        //     console.log(cnt);     
        //     sql3 = `UPDATE Board SET numComments = ${cnt} WHERE id = ${req.params.boardId}`;
        //     console.log(sql3);
        //     conn.query(sql3);
        // });
        await conn.query(sql4, async (error, rows) => {
            console.log(sql4);
            await conn.commit();
            res.send(rows);
        })
    } catch (err) {
        console.log(err)
        await conn.rollback()
        res.status(500).json(err)
    }
});

// Board Search
router.get('/Board/Search/ContentNum/:boardType/:column/:searchKey', (req, res) => {
    let sql;
    if (req.params.column !== '0')
        sql = `SELECT COUNT(*) FROM board_vw WHERE (type=${req.params.boardType} AND ${req.params.column} LIKE '%${req.params.searchKey}%')`;
    else // all
        sql = `SELECT COUNT(*) FROM board_vw WHERE (type=${req.params.boardType} AND (title LIKE '%${req.params.searchKey}%' OR author LIKE '%${req.params.searchKey}%'))`;
        // sql = `SELECT * FROM board WHERE (type=${req.params.boardType} AND (title LIKE '%${req.params.searchKey}%' OR author LIKE '%${req.params.searchKey}%' OR content LIKE '%${req.params.searchKey}%'))`;
    console.log(sql);
    conn.query(sql, function (error, rows, fields) {
        if (!error) {
            console.log(rows);
            res.send(rows);
        } else {
            console.log('query error : ' + error);
        }
    });
});

router.get('/Board/Search/:boardType/:column/:searchKey/:startIdx/:num', (req, res) => {
    let sql;
    if (req.params.column !== '0')
        sql = `SELECT * FROM board_vw WHERE (type=${req.params.boardType} AND ${req.params.column} LIKE '%${req.params.searchKey}%') ORDER BY id DESC LIMIT ${req.params.startIdx}, ${req.params.num}`;
    else // all
        sql = `SELECT * FROM board_vw WHERE (type=${req.params.boardType} AND (title LIKE '%${req.params.searchKey}%' OR author LIKE '%${req.params.searchKey}%')) ORDER BY id DESC LIMIT ${req.params.startIdx}, ${req.params.num}`;
        // sql = `SELECT * FROM board WHERE (type=${req.params.boardType} AND (title LIKE '%${req.params.searchKey}%' OR author LIKE '%${req.params.searchKey}%' OR content LIKE '%${req.params.searchKey}%'))`;
    console.log(sql);
    conn.query(sql, function (error, rows, fields) {
        if (!error) {
            // console.log(rows);
            res.send(rows);
        } else {
            console.log('query error : ' + error);
        }
    });
});

// 게시글 이미지 처리
const uploadImg = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/Images/Board');
        },
        filename(req, file, cb) {
            let ext = path.extname(file.originalname); // 파일 확장자
            console.log('file.originalName', file.originalname);
            let fileName = `${req.params.boardType}_${Date.now()}${ext}`; // 나중에 board 지워지는 경우 boardType_ 으로 시작하는 이미지 다 삭제
            console.log('file.savedName', fileName);
            cb(null, fileName);
        },
    }),
    // limits: { fileSize: 5 * 1024 * 1024 },
})


router.post('/Board/:boardType/Img', uploadImg.single('img'), (req, res) => {
    // public/Board 에 정수 번호로 저장
    console.log('전달받은 파일', req.file);
    console.log('저장된 파일의 이름', req.file.filename);

    // 파일이 저장된 경로를 반환
    let imgUrl = `/Images/Board/${req.file.filename}`;
    console.log(imgUrl);
    res.json({url: imgUrl});
})



module.exports = router;