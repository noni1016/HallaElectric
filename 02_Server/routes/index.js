var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.json('index route / ');
})

router.get('/noni', function (req, res, next) {
    res.json('index route /noni');
})

module.exports = router;