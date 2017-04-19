module.exports = function(conn){
  var express = require('express');
  var router = express.Router();

  router.get('/read',function(req,res){
      var pboardno = req.param('pboardno');
      var sql = 'select *from product_board b join products p on b.pno = p.pno where pboardno =' + pboardno;
      conn.query(sql,function(err,rows){
          if(err){
            console.log(err);
          }else{
            var color =  rows[0].color.split(',');
            res.render('productRead',{rows:rows,color:color});
          }
      });

  });

  router.post('/cartAdd',function(req,res){
      console.log(req.body.id);
  });

  return router;

};
