const { userinfo } = require('../models/userinfo');
const db = require('../db')

module.exports = {
    login: async(req,res) =>{
        const usersInfo = await userinfo.findOne({
            where:{
                user_email: req.body.email,
                password: req.body.password
            }
        })
        if(!userinfo){
            res.status(404).send('이메일 혹은 비밀번호가 일치하지 않습니다')
        }
        else{
            req.session.userId = usersInfo.user_email
            req.session.save(()=>{
                console.log('save')
            })
            res.status(200).send("login")
        }
    },
    signup:async(req,res)=>{
        const email = req.body.email
        const password = req.body.password
        const nickName = req.body.nickName
        console.log(req.body)
        if(email||password||nickName === undefined){
            res.status(422).send('insufficient parameters supplied')
        }
        
        const userEmailInfo = await userinfo.findAll({
            where:{
                user_email:email
            }
        })
        if(userEmailInfo){
            res.status(409).send('중복된 이메일 입니다')
        }
        const userNickInfo = await userinfo.findOne({
            where:{
                nickName:nickName
            }
        })
        if(userNickInfo){
            res.status(409).send('중복된 닉네임 입니다')
        }
        db.query(`INSERT INTO userInfos(user_email,password,user_nickName)
         VALUES (${email},${password},${nickName})`,function(err,callback){
             if(callback){
                 res.status(201).send('sucess signup')
             }
             else{
                 res.status(400).send('fail signup')
             }
         })
    },
    userInfo:async(req,res)=>{
        const userInfo = await userinfo.findOne({
            where:{email:req.session.userId}
        })
        if(userInfo){
            res.status(200).send({
                data:userInfo,
                message:"sucess load userInfo"
            })
        }
        else{
            res.status(404).send({
                data:null,
                message:"can not find userInfo"
            })
        }
    }
    ,
    change:async(req,res)=>{
        const userInfo = await userinfo.findOne({
            where:{
                user_email:req.session.userId
            }
        })
        if(userInfo){
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
    signout: (req,res)=>{
        req.session.destory(function(err){
            console.log('err')
        })
        res.status(205).send('logout sucess')
    }
}