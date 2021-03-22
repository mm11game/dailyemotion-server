const express = require('express');
const https = require('https')
const fs = require('fs')
const cors = require('cors')
const session = require('express-session')
require('./models')
const app = express();
const textController = require('./controllers/text')
const userController = require('./controllers/user')
const PORT = 5000;
app.use(cors({
    origin:'https://projectb1.com',
    option:['GET, POST, OPTION'],
    credentials:true
}))
app.use(express.json()); 
app.use(express.urlencoded( {extended : false } ));
app.use(
    session({
        secret: '@dailyemotion',
        resave:false,
        saveUninitialized:true,
        cookie:{
            domain:'projectb1.com',
            path:'/',
            maxAge: 24 * 6 * 60 * 10000,
            sameSite: 'none',
            httpOnly: true,
            secure: 'none'
        }
    })
)
// app.use('/', (req,res)=>{
//     res.send('hello every one')
// })// hello every one위해서 넣음
app.get("/user/userInfo",userController.userInfo)
app.get("/text/textList",textController.textList)
app.get("/text/garbageList",textController.garbageList)

app.post("/user/login",userController.login)
app.post("/user/signup",userController.signup)
app.post("/user/signout",userController.signout)
app.post("/user/change",userController.change)
app.post("/text/textRecord",textController.textRecord)
app.post("/text/textChange",textController.textChange)
app.post("/text/finalDelete",textController.finalDelete)
app.post("/text/goToGarbage",textController.goToGarbage)
app.post("/text/undo",textController.undo)
app.post("/text/test",textController.test1)
let server
if(fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")){
    server = https
      .createServer(
        {
          key: fs.readFileSync(__dirname + `/` + 'key.pem', 'utf-8'),
          cert: fs.readFileSync(__dirname + `/` + 'cert.pem', 'utf-8'),
        },
        app
      )
      .listen(PORT);
      } else {
        server = app.listen(PORT)
      }
// let server = https.createServer(
//     {
//     cert: fs.readFileSync('/etc/letsencrypt/live/projectb1.com/fullchain.pem'),
//     key: fs.readFileSync('/etc/letsencrypt/live/projectb1.com/privkey.pem')
// }
// .listen(5000,() =>{
//     console.log('5000')
// }))
// app.listen(PORT,() =>{
//     console.log('SERVER ON 4000')
// })
// app.listen(5000,() => {
//     console.log('server on 5000')
// })
module.exports = server;
