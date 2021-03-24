const { userInfo } = require('../models');
const db = require('../db')
console.log(userInfo)
module.exports = {
    login: async(req,res) =>{
        const userInfos = await userInfo.findOne({
            where:{
                user_email: req.body.email,
                password: req.body.password
            }
        });
        console.log(userInfos.user_email)
        if(!userInfos){
            res.status(404).send('이메일 혹은 비밀번호가 일치하지 않습니다');
        }
        else{
            console.log(req.session);
            req.session.userId = userInfos.user_email
            req.session.save(function(){
                req.session.userId = userInfos.user_email
                res.status(200).send(userInfos.nickName);
                console.log('save');
            }),
            console.log(req.session);
        }
    },
    signup:async(req,res)=>{
        const email = req.body.email;
        const password = req.body.password;
        const nickName = req.body.nickName;
        const confirmPassword = req.body.confirmPassword;
        console.log(email,password,nickName,confirmPassword);
        
        const userEmailInfo = await userInfo.findOne({
            where:{
                user_email:email
            }
        })
        const userNickInfo = await userInfo.findOne({
            where:{
                nickName:nickName
            }
        });
        if(userEmailInfo){
            res.status(409).send('중복된 이메일 입니다');
        }
        
        else if(userNickInfo){
            res.status(409).send('중복된 닉네임 입니다');
            
        }
        else if(password !== confirmPassword){
            res.status(400).send('비밀번호가 맞지 않습니다.');
        }
        else{db.query(`INSERT INTO userInfos (user_email,password,nickName)
         VALUES ('${email}','${password}','${nickName}')`,function(err,callback){
             console.log(err);
             console.log(callback);
             if(err){
                 res.status(400).send('fail signup');
             }
             else{
                res.status(201).send('sucess signup');
             }
         })}
    },
    userInfo:async(req,res)=>{
        const userInfos = await userInfo.findOne({
            where:{email:req.session.userId}
        })
        if(userInfos){
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
        const userInfos = await userInfo.findOne({
            where:{
                user_email:req.session.userId
            }
        })
        if(userInfos){
            const nickName = req.body.nickName
            const password = req.body.password
            console.log(userInfos.dataValues)
            console.log(req.body)
            if(nickName){
                db.query(`UPDATE userInfos SET nickName = '${nickName}' WHERE user_email = '${userInfos.dataValues.user_email}'`,function(err,callback){
                    if(callback){
                        console.log('change nickName')
                    }
                })
            }
            if(password){
                db.query(`UPDATE userInfos SET password = '${password}'  WHERE user_email = '${userInfos.dataValues.user_email}'`,function(err,callback){
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

        req.session.userId = null
        console.log(req.session)
        res.status(200).send('logout sucess')
    },
    user: async(req,res)=>{
        console.log(req.session);
        const userInfos = await userInfo.findOne({
            where:{user_email:req.session.userId}
        });
        console.log(userInfos);
        if(userInfos){
            res.status(200).send({
                data:{email:userInfos.user_email, nickName:userInfos.nickName},
                message: '1ok'
            }
            );
        }else{
            res.status(404).send('fail user');
        }
    }
}