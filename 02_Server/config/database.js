var mysql = require('mysql');
var db_info = {
    host: 'wwwproject.iptime.org',
    port: '3306',
    user: 'root',
    password: 'www123',
    database: 'hanla'
}

var conn = mysql.createConnection(db_info);

conn.connect(function(err) {
    if(err) console.error('mysql connection error : ' + err);
    else console.log('mysql is connected successfully!');
});

module.exports = conn;