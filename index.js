const express = require('express');
const https = require('https')
const fs = require('fs')
const cors = require('cors')
const session = require('express-session')
require('./models')
const app = express();
const controller = require('./controllers')
const PORT = process.env.PORT||4000;
app.use(cors({
    origin:'https://localhost:4000',
    option:['GET, POST, OPTION'],
    credentials:true
}))
app.use(express.json()); 
app.use(express.urlencoded( {extended : false } ));
app.use(
    session({
        secret: '',
        resave:false,
        saveUninitialized:true,
        cookie:{
            domain:'localhost',
            path:'/',
            maxAge: 24 * 6 * 60 * 10000,
            sameSite: 'none',
            httpOnly: true,
            secure: 'none'
        }
    })
)
app.use('/', (req,res)=>{
    res.send('hello every one')
})// hello every one위해서 넣음
app.get("/user/userInfo",controller.userInfo)
app.get("/text/textList",controller.textList)
app.get("/text/garbageList",controller.garbageList)

app.post("/user/login",controller.login)
app.post("/user/signup",controller.signup)
app.post("/user/signout",controller.signout)
app.post("/user/change",controller.change)
app.post("/text/textRecord",controller.textRecord)
app.post("/text/textChange",controller.textChange)
app.post("/text/finalDelete",controller.finalDelte)
app.post("/text/goToGarbage",controller.goToGarbage)
app.post("/text/undo",controller.undo)

let server = https.createServer({
    cert: fs.readFileSync('/etc/letsencrypt/live/projectb1.com/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/projectb1.com/privkey.pem')
})
app.listen(PORT,() =>{
    console.log('SERVER ON 4000')
})
app.listen(5000,() => {
    console.log('server on 5000')
})
module.exports = server;
