

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

  router.post('/cartAdd',function(req,res){
      conn.query(sql,cart,function(err,rows){
        if(err){
          console.log(err);
        }else {
            res.send('success');
        }
      });
  });

  router.get('/order',function(req,res){
      var user_num = req.user.user_num;
      console.log('order:'+user_num);
      var sql ='SELECT c.cartno,c.user_num,c.pboardno,c.size,c.color,c.productcount,c.price,p.mainimage,p.productname,b.pno FROM cart c join product_board b join products p where c.user_num = ? and c.pboardno = b.pboardno and b.pno = p.pno';
      conn.query(sql,[user_num],function(err,rows){
        if(err){
          console.log(err);
        }else{
            var sqlPrice = 'select sum(price)as price ,count(pboardno) as totalcount from cart where user_num = ?';
            conn.query(sqlPrice,[user_num],function(err,price){
            res.render('order',{rows:rows,total:price});
          });
        }
      });
  });

  router.post('/orderProductAdd',function(req,res){
      var pno = req.body.pno.split(',');
      var size = req.body.size.split(',');
      var color = req.body.color.split(',');
      var pcount= req.body.pcount.split(',');
      var price = req.body.price.split(',');

      for(var i =0; i<pno.length; i++){
        var orderdetail = {
          orderDetailno : req.body.orderDetailno,
          user_num : req.body.user_num,
          pno : pno[i],
          size : size[i],
          color : color[i],
          pcount : pcount[i],
          price : price[i]
        };
        b(orderdetail);
      }
      res.send('success');
  });

  router.post('/order',function(req,res){
    var order = {
      user_num : req.body.user_num,
      orderName : req.body.orderName,
      orderPhone : req.body.orderPhone,
      orderEmail : req.body.orderEmail,
      orderAddress : req.body.orderAddress,
      orderDetailno : req.body.orderDetailno,
      orderMessage : req.body.orderMessage,
      totalCount : req.body.totalCount,
      totalPrice : req.body.totalPrice,
      productHead : req.body.productHead

    };
    var sql = 'insert into ordertable set ?';
    conn.query(sql,order,function(err,rows){
        if(err){
          console.log(err);
        }else{
          var user_num = req.body.user_num;
          var sql = 'delete from cart where user_num = ? ';
          conn.query(sql,[user_num],function(err,rows){
              if(err){
                console.log(err);
              }else{
                res.send('success');
              }
          });
        }
    });
    
  });
  router.get('/orderComplete',function(req,res){
    res.render('orderComplete');
  });

  router.get('/mypage',function(req,res){
      res.render('mypage');
  });
  router.get('/mypage/orderList',function(req,res){
    var user_num =  req.user.user_num ;
    var sql ='select * from ordertable where user_num =?';
    conn.query(sql,[user_num],function(err,rows){
          if(err){
            console.log(err);
          }else{
            res.render('orderList',{rows:rows});
          }
    });
  });

var b = function sqlAdd(orderdetail){
    console.log(orderdetail);
    var sql = 'insert into orderdetail set ?';
    conn.query(sql,orderdetail,function(err,rows){
    });
  };
  return router;
};
