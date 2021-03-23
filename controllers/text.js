const db = require('../db')

const { text } = require('../models');
const { emotion } = require('../models');
function getToday(){
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    return year +'-'+ month +'-'+ day;
}
let now = getToday()
console.log(now)

module.exports = {
    test1:(req,res)=>{
        res.status(200).send(req.body)
    },
    textRecord: (req,res) =>{
        const email = req.session.userId//(세션)
        const textContent = req.body.textContent
        const emotionId = req.body.emotionId
        if(email||textContent||emotionId === null){
            res.status(404).send('값이 다 입력되지 않았습니다')
        }
        db.query(`SELECT user_email FROM userInfo WHERE user_email = ${email}`,function(err,result){
            if(result){
                db.query(`INSERT INTO text(textContent,emotionlist_id,user_email,text_status,date) 
                VALUES (${textContent},${emotionId},${result},0,${now})`,function(err,callback){
                    if(callback){
                        res.status(200).send('sucess text recording')
                        //감정 텍스트 다대다로 표현하면 text.id = text.emotionlistId
                        //emotionlist.textid = text.emotionlistid
                        //req.body.emotionId = array
                    }
                    else{
                        res.status(400).send("can not write text")
                    }
                })
            }
            else{
                res.status(404).send('유저 정보를 찾을 수 없습니다')
            }
        })
    },
    textList: async(req,res)=>{
        const textlist = await text.findAll({
            where:{
                user_email:req.session.userId,
                text_status:'0'
            }
        })
        if(textlist) {
            res.status(200).send({
                data: textlist,
                message: 'finished load'
            })
        }
        else{
            res.status(404).send({
                data:null,
                message:'can not found'
            })
        }
    },
    textChange: (req,res)=>{
        const text_id = req.body.text_id
        const text_content = req.body.textContent
        const emotion = req.body.emotionId
        // if(text_id||text_content||emotion === undefined){
        //     res.status(404).send('정보가 부족합니다')
        // }
        if(text_id&&text_content&emotion){db.query(`UPDATE texts SET text_content = ${text_content}, emotionlist_id = ${emotion}
        WHERE text_id = ${text_id}`),function(err,callback){
            if(callback){
                res.status(200).send('complete chagnge text')
            }
            else{
                res.status(400).send('can not change text')
            }
        }}
        res.status(400).send('error')
    },
    finalDelete: (req,res)=>{
        const text_id = req.body.text_id
        if(!text_id){
            res.status(400).send('Bad request')
        }
        db.query(`DELETE FROM texts where id = ${text_id}`,function(err,callback){
            if(callback){//callback 있나 확인 update도
                res.status(200).send('complete delete')
            }
            else{
                res.status(400).send('bad request')
            }
        })
    },
    goToGarbage:(req,res) =>{
        const text_id = req.body.text_id
        const text_status = req.body.text_status
        if(text_status !== 0){
            res.status(400).send('Bad request')
        }
        if(!text_id){
            res.status(400).send('Bad request')
        }
        db.query(`UPDATE texts SET text_status = 1 WHERE text_id = ${text_id}`,function(err,callback){
            if(callback){
                res.status(200).send('Go to garbage')
            }
            else{
                res.status(400).send('Bad request')
            }
        })
    },
    garbageList:async(req,res)=>{
        const garbageList = await text.findAll({
            where:{
                // user_email:req.session.userId,
                text_status:'1'}
        })
        if(garbageList){
            res.status(200).send({
                data:garbageList,
                message:'Load garbageList'})
        }
        else{
            res.status(404).send({
                data:null,
                message:'can not find'
            })
        }
    },
    undo:(req,res) =>{
        const text_id = req.body.text_id
        const text_status = req.body.text_status
        if(!text_id){
            res.status(400).send('Bad request')
        }
        if(text_status !== 1){
            res.status(400).send("Bad request")
        }
        db.query(`UPDATE texts SET text_status = 0 WHERE text_id = ${text_id}`,function(err,callback){
            if(callback){
                res.status(200).send('Go to garbage')
            }
            else{
                res.status(400).send('Bad request')
            }
        })
    }

    
}