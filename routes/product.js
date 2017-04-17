module.exports = function(conn){
  var express = require('express');
  var router = express.Router();

  router.get('/read',function(req,res){
      var pno = req.param('pno');
      var sql = 'select *from products where pno ='+ pno;
      conn.query(sql,function(err,rows){
          if(err){
            console.log(err);
          }else{
            var color =  rows[0].color.split(',');
            res.render('productRead',{rows:rows,color:color});
          }
      });



  });

  return router;

};
