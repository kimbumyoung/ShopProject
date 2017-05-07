
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
      conn.end();

    console.log(product);
  //console.log(productname,content,mainimage,color,price,contentimage,category);
    console.log(req.files[0]);
  });

  router.get('/add_productlist',function(req,res){
    var sql = 'select *from products';

    conn.query(sql,function(err,rows){
        console.log(rows);
        res.render('admin_productlist',{rows:rows});
    });
      conn.end();
  });

router.post('/productlist',function(req,res){
  var pno = req.body.pno;
  var sql = 'insert into product_board (pno) values (?)';
  conn.query(sql,[pno],function(err,rows){
      console.log(rows);
  });
    conn.end();
});
router.get('/noticeList',function(req,res){
  var sql = 'select *from notice';
  var array= [];
  conn.query(sql,function(err,rows){
      if(err){
        console.log(err);
      }else{

        for(var i=0;i<rows.length; i++){
          var date = new Date([rows[i].noticedate]);
          array[i]= date.toFormatString("yyyy-MM-dd");
        }
        res.render('admin_noticeList',{rows:rows,date:array});
      }
  });
    conn.end();
  console.log('공지사항 읽기');

});
router.get('/noticeRegister',function(req,res){
  console.log('공지사항 작성');
  res.render('admin_noticeRegister');
});
router.post('/noticeRegister',function(req,res){

  var notice = {
    title : req.body.title,
    content : req.body.content
  };
  var sql = 'insert into notice set ?';
  conn.query(sql,notice,function(err,rows){
    if(err){
      console.log(err);
    }else{
      res.redirect('/noticeList');
    }
  });
    conn.end();
});

router.get('/noticeRead',function(req,res){
  var noticeno = req.param('noticeno');
  var sql = 'select *from notice where noticeno = ?';
  conn.query(sql,[noticeno],function(err,rows){
    if(err){
      console.log(err);
    }else{
      var noticedate;
      var date = new Date([rows[0].noticedate]);
      noticedate= date.toFormatString("yyyy-MM-dd");
      res.render('noticeRead',{rows:rows,noticedate:noticedate});
    }

  });
    conn.end();
});

Date.prototype.toFormatString = function(format) {
      var year = this.getFullYear();
      var month = this.getMonth() + 1;
      var day = this.getDate();
      var hour = this.getHours();
      var minute = this.getMinutes();
      var second = this.getSeconds();
      if (format === null) format = "yyyy-MM-dd";
      format = format.replace("yyyy", year);
      format = (month < 10) ? format.replace("MM", "0" + month) : format.replace("MM", month);
      format = format.replace("M", month);
      format = (day < 10) ? format.replace("dd", "0" + day) : format.replace("dd", day);
      format = format.replace("d", day);
      format = (hour < 10) ? format.replace("HH", "0" + hour) : format.replace("HH", hour);
      format = (minute < 10) ? format.replace("mm", "0" + minute) : format.replace("mm", minute);
      format = (second < 10) ? format.replace("ss", "0" + second) : format.replace("ss", second);
      return format;
};


  return router;

};
