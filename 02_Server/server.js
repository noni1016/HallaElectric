const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// sql connection
const conn = require('./config/database');

// Route
app.use(express.text());
// app.use(express.json());
app.use(express.json({ limit : "50mb" })); app.use(express.urlencoded({ limit:"50mb", extended: false }));
// app.use('/index', require('./routes/index'));
// app.use('/user',  require('./routes/user'));
// app.use('/schedule',  require('./routes/schedule'));
// app.use('/BoardCrud', require('./routes/BoardCrud'));
app.use('/', require('./routes/ImgCardsRestApi'));
app.use('/', require('./routes/Intro'));
app.use('/', require('./routes/Board'))
app.use(express.static('public'));



// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.get('/select', (req, res) => {
  let sql = 'SELECT * FROM test';
  conn.query(sql, function (error, rows, fields) {
    if (!error) {
      console.log(rows);
      res.send(rows);
    } else {
      console.log('query error : ' + error);
    }
  });
});
