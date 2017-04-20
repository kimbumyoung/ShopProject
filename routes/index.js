

module.exports = function(conn){
  var express = require('express');
  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res) {
      console.log('222222222222222222'+req.session.user);
    var sql = 'select *from product_board b join products p on b.pno = p.pno';
    conn.query(sql,function(err,rows){

      res.render('index',{rows:rows});
    });

  });

  router.get('/test',function(req,res){
    console.log('eeee');
    res.render('test');
  });
  router.get('/admin',function(req,res){
    res.render('admin_index');
  });


  return router;
};
