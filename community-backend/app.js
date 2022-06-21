const express = require('express');
const app = express();
const authRouter = require('./routes/auth/auth');
const apiRouter = require('./routes/api/router');
const cors = require('cors')
const connect = require('./public/mongoose')
require('dotenv').config();

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;


// const User = require('../../schema/user')
// const Board = require('../../schema/board')
// const Token = require('../../schema/token')


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin:"*"
}))

app.use('/auth', authRouter);
app.use('/api', apiRouter);



app.get('/', (req,res) => {
  res.status(200).send('hello world!')
})







app.listen(PORT, function () {
    connect();
    console.log('Example app listening on port : ' + PORT);
});