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
    var sql = 'insert into notice_reply set ?';
    var query =  conn.query(sql,reply,function(err,rows){
      if(err){
        console.log(err);
      }else{
        result = {
          writername : query.values.writername,
          reply_content : query.values.reply_content
        }
        res.send(result);
      }
    });

  });

return router;

};
