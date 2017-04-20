

module.exports = function(conn){
  var express = require('express');
  var router = express.Router();

  /* GET users listing. */
  router.get('/', function(req, res) {
    res.send('respond with a resource');

  });
  router.get('/cartList',function(req,res){
    var user_num = req.user.user_num;
    console.log("user_num : "+user_num);
    var sql = 'SELECT c.cartno,c.user_num,c.pboardno,c.size,c.color,c.productcount,c.price,p.mainimage,p.productname FROM cart c join product_board b join products p where c.user_num = ? and c.pboardno = b.pboardno and b.pno = p.pno';
    conn.query(sql,[user_num],function(err,rows){
      console.log(rows);
        res.render('cartList',{rows:rows});
    });
  });

  return router;
};
