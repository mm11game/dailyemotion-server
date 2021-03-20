const mysql = require('mysql');
const dotenv = require('dotenv');
const config = require('../config/config');
dotenv.config();
// const connection = mysql.createConnection({
//     host: 'database-2.ckixfmoji8jp.ap-northeast-2.rds.amazonaws.com',
//     port: '13306',
//     user: 'admin',
//     password: 'dlaudcks1',
//     database: 'dailyemotion'
// }
// );
// connection.connect(function(err){
//     if(err){
       
//         return;
//     }
//     console.log('connceted to database')
// })

// connection.query('SELECT * FROM texts',function(err,result){
//     console.log(result)
// })
// module.exports= connection


const con = mysql.createConnection(
    config[process.env.NODE_ENV || 'development']

)
con.connect(function(error){
    if(error) throw error
})
console.log(con)

module.exports = con