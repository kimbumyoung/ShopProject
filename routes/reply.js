module.exports = function(conn){
  var express = require('express');
  var router = express.Router();


  router.post('/register',function(req,res){
    var reply = {
      noticeno : req.body.noticeno,
      reply_content : req.body.reply_content,
      writername :  req.body.writername,
      user_num : req.body.user_num,
    };

    console.log(reply);
    console.dir(reply);
    var sql = 'insert into notice_reply set ?';
    conn.query(sql,reply,function(err,rows){
      if(err){
        console.log(err);
      }else{
          console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
          console.log(rows);
          res.send(rows);
      }
    });

  });

return router;

};
