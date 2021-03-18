const express = require('express');
const app = express();
const PORT = process.env.PORT||4000;

app.use('/', (req,res)=>{
    res.send('hello every one')
})
app.listen(5000,() => {
    console.log('server on 5000')
})