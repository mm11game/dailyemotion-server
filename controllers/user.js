const { userinfo } = require('../models');
const { nickname } = require('../models');
const db = require('../db')

module.exports = {
    login: async(req,res) =>{
        const userInfo = await userinfo.findOne({
            where:{
                user_email: req.body.email,
                password: password
            }
        })
        if(!userinfo){
            res.status(404).send('이메일 혹은 비밀번호가 일치하지 않습니다')
        }
        else{
            req.session.userId = userInfo.email
            req.session.save(()=>{
                console.log('save')
            })
        }
    },
    signup:async(req,res)=>{
        const user_email = req.body.email
        const password = req.body.password
        const nickName = req.body.nickName
        const userEmailInfo = userinfo.findOne({
            where:{
                user_email:req.body.email
            }
        })
        if(userEmailInfo){
            res.status(400).send('중복된 이메일 입니다')
        }
        const userNickInfo = userinfo.findOne({
            where:{
                user_nickName:req.body.nickName
            }
        })
        if(userNickInfo){
            res.status(400).send('중복된 닉네임 입니다')
        }
        if(user_email||password||nickName === null){
            res.status(400).send('정보가 부족합니다')
        }
        db.query(`INSERT INTO userInfos(user_email,password,user_nickName)
         VALUES (${user_email},${password},${nickName})`,function(err,callback){
             if(callback){
                 res.status(200).send('sucess signup')
             }
             else{
                 res.status(400).send('fail signup')
             }
         })
    },
    change:async(req,res)=>{
        const userInfo = await userinfo.findOne({
            where:{
                email:req.session.userId
            }
        })
        if(userinfo){
            const nickName = req.body.nickName
            const password = req.body.password
            if(nickName){
                db.query(`UPDATE userInfos SET nickName = ${nickName}`,function(err,callback){
                    if(callback){
                        console.log('change nickName')
                    }
                })
            }
            if(password){
                db.query(`UPDATE userInfos SET password = ${password}`,function(err,callback){
                    if(callback){
                        console.log('change password')
                    }
                })
            }
            res.status(200).send('변경이 완료됬습니다')
        }
        else{
            res.status(404).send('유저 정보가 없습니다')
        }
    },
    logout: (req,res)=>{
        req.session.destory(function(err){
            console.log('err')
        })
        res.status(205).send('logout sucess')
    }
}