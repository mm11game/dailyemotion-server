const db = require("../db/index");
const { userInfo } = require("../models");
const { text } = require("../models");
const { emotion } = require("../models");
function getToday() {
  var date = new Date();
  var year = date.getFullYear();
  var month = ("0" + (1 + date.getMonth())).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  return year + "-" + month + "-" + day;
}
let now = getToday();
console.log(now);

module.exports = {
  test1: (req, res) => {
    res.status(200).send(req.body);
  },
  textRecord: async (req, res) => {
    const email = req.session.userId; //(세션)
    const textContent = req.body.textContent;
    const emotionId = req.body.emotionId;
    console.log(email, textContent, emotionId);
    if (email && textContent !== null) {
      const userEmailInfo = await userInfo.findOne({
        where: {
          user_email: email,
        },
      });
      if (userEmailInfo) {
        console.log(now, "1");
        console.log("0");
        db.query(
          `INSERT INTO texts (text_content,emotionlist_id,user_email,text_status,date) 
                VALUES ('${textContent}',${emotionId},'${email}',0,'${now}')`,
          function (err, callback) {
            console.log("1");
            if (err) {
              console.log(err);
              res.status(400).send("can not write text");
              //감정 텍스트 다대다로 표현하면 text.id = text.emotionlistId
              //emotionlist.textid = text.emotionlistid
              //req.body.emotionId = array
            } else {
              res.status(200).send("sucess text recording");
            }
          }
        );
      } else {
        res.status(400).send("you can not write text");
      }
    } else {
      res.status(404).send("값이 다 입력되지 않았습니다");
    }
  },
  textList: async (req, res) => {
    console.log("리스트에서 세션이 유지되는가?", req.session);
    const textlist = await text.findAll({
      where: {
        user_email: req.session.userId,
        text_status: "0",
      },
    });
    if (textlist) {
      res.status(200).send({
        data: textlist,
        message: "finished load",
      });
    } else {
      res.status(404).send({
        data: null,
        message: "can not found",
      });
    }
  },
  textChange: (req, res) => {
    const text_id = req.body.text_id;
    const text_content = req.body.textContent;
    const emotion = req.body.emotionId;
    // if(text_id||text_content||emotion === undefined){
    //     res.status(404).send('정보가 부족합니다')
    // }
    console.log(text_id, text_content, emotion);
    console.log("abc");
    if (text_id && text_content && emotion !== null) {
      db.query(
        `UPDATE texts SET text_content = '${text_content}', emotionlist_id = ${emotion}
         WHERE id = ${text_id}`,
        function (err, callback) {
          console.log("att");
          if (err) {
            console.log(err);
            res.status(400).send("can not change text");
          } else {
            res.status(200).send("complete chagnge text");
          }
        }
      );
    } else {
      res.status(400).send("error");
    }
  },
  finalDelete: (req, res) => {
    console.log("텍스트 아이디 바디 값", req.body);
    const text_id = req.body.text_id;

    if (!text_id) {
      res.status(400).send("Bad request");
    }
    for (let i = 0; i < text_id.length; i++) {
      let textNumber = text_id[i];
      db.query(
        `DELETE FROM texts where id = ${textNumber}`,
        function (err, callback) {
          if (err) {
            //callback 있나 확인 update도
            res.status(400).send("bad request");
          } else {
            res.status(200).send("complete");
          }
        }
      );
    }
  },
  goToGarbage: (req, res) => {
    const text_id = req.body.text_id;
    const text_status = req.body.text_status;
    console.log("고드가비지 리퀘스트바디", req.body);
    console.log(String(text_id));
    if (String(text_id) === undefined || text_status !== "0") {
      res
        .status(400)
        .send("텍스트아이디가 없거나, 스테이터스가 0이다 Bad request");
    } else {
      db.query(
        `UPDATE texts SET text_status = 1 WHERE id = ${text_id}`,
        function (err, callback) {
          if (err) {
            console.log(err);
            res.status(400).send("잘못된Bad equest");
          } else {
            res.status(200).send("Go to garbage");
          }
        }
      );
    }
  },
  garbageList: async (req, res) => {
    const garbageList = await text.findAll({
      where: {
        // user_email:req.session.userId,
        text_status: "1",
      },
    });
    if (garbageList) {
      res.status(200).send({
        data: garbageList,
        message: "Load garbageList",
      });
    } else {
      res.status(404).send({
        data: null,
        message: "can not find",
      });
    }
  },
  undo: (req, res) => {
    const text_id = req.body.text_id;
    const text_status = req.body.text_status;
    if (text_id === null || text_status !== "1") {
      res.status(400).send("Bad request");
    } else {
      db.query(
        `UPDATE texts SET text_status = 0 WHERE id = ${text_id}`,
        function (err, callback) {
          if (err) {
            res.status(400).send("Bad request");
          } else {
            res.status(200).send("Go to texts");
          }
        }
      );
    }
  },
};
