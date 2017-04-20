
module.exports = function(app,conn){

  var express = require('express');
  var router = express.Router();
  var multer  = require('multer');
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/');  //파일 저장경로 (dest)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); //파일명
    }
  });

  var upload = multer({ storage: storage }); //_storage의 property와 함수를 실행
  /* GET home page. */

  router.get('/add_product',function(req,res){
    res.render('admin_add_product');
  });

  router.post('/add_product',upload.array('mainimage'),function(req,res){
    //upload.single('avatar') middleware 사용자가 전송한 데이터에서 파일이 있으면 req에 파일 property 암시적 추가
    //jade에서 보낸 input file에 name을 적어줘야한다 upload.single('파일 name값');
    var color = req.body.color.join(','); // , split
    var product = {
      productname : req.body.productname,
      content : req.body.content,
      mainimage : req.files[0].originalname,
      color : color,
      price : req.body.price,
      contentimage : req.files[1].originalname,
      category : req.body.category
    };
    var sql = 'insert into products set ?';
    conn.query(sql,[product],function(err,rows){
      if(err){
        console.log(err);
      }
        console.log(rows);
    });

    console.log(product);
  //console.log(productname,content,mainimage,color,price,contentimage,category);
    console.log(req.files[0]);
  });

  router.get('/add_productlist',function(req,res){
    var sql = 'select *from product_board b join products p on b.pno = p.pno';

    conn.query(sql,function(err,rows){
        console.log(rows);
        res.render('admin_productlist',{rows:rows});
    });
router.post('/productlist',function(req,res){
  var pno = req.body.pno;
  var sql = 'insert into product_board (pno) values (?)';
  conn.query(sql,[pno],function(err,rows){
      console.log(rows);
  });

});

  });

  return router;

};
