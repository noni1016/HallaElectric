var express = require('express');
var moment = require('moment');
var router = express.Router();

// sql connection
const conn = require('../config/database');

router.get('/', function (req, res, next) {
    res.json('schedule route / ');
});

router.post('/add', function (req, res, next) {
    let schedule = req.body;
    console.log(schedule);
    let sql = `INSERT INTO schedule (id, title, user_id, allday, start, end) VALUES (
              '${schedule.id}',
              '${schedule.title}',
              '${schedule.userId}',
              '${schedule.allDay ? 1 : 0}',
              '${moment(schedule.start).format('YYYY-MM-DD HH:mm:ss')}',
              '${moment(schedule.end).format('YYYY-MM-DD HH:mm:ss')}')`;

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