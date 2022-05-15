var express = require('express');
var router = express.Router();

// sql connection
const conn = require('../config/database');

router.get('/', function (req, res, next) {
    res.json('user route / ');
});
/*
router.post('/get', function (req, res, next) {
    let sql = `SELECT * FROM user WHERE id=${req.body.id}`;
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
*/

router.get('/get/:id', function (req, res, next) {
  let sql = `SELECT * FROM user WHERE id=${req.params.id}`;
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

router.post('/add', function (req, res, next) {
    console.log('request on');
    console.log(req.body);
    let sql = `INSERT INTO user (id, name, gender) VALUES ('${req.body.id}', '${req.body.name}', '${req.body.gender}')`;

    conn.query(sql, function (error, rows, fields) {
      if (!error) {
        console.log(rows);
        res.send(rows);
      } else {
        console.log('query error : ' + error);
      }
    });
});

module.exports = router;