const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const url = 'mongodb://localhost:27017/test'
const connect = () => {
    mongoose.set('debug', true); // 몽고 쿼리가 콘솔에서 뜨게 한다.
    mongoose.connect(url, {
        dbName: 'mydb', // 실제로 데이터 저장할 db명
        useNewUrlParser: true,
    }, (err) => {
            if(err) console.log(err) 
            else console.log("mongdb is connected");
           })
};






module.exports = connect;




