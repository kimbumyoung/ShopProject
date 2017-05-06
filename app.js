var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var session = require('express-session');
var passport = require('passport');

var app = express();
app.use(session({
  secret : 'dsdfsdfwerwer!!!sdfsdfs', // session id 보안 아무값이나 넣어도된다.
  resave: false, //session Id를 접속할때마다 새로발급을 하지 말라
  saveUnintialized: true //session을 사용하기전까지는 발급을 하지말라
//위 사항은 권장값이다.
}));
var conn = mysql.createConnection({
  //host : 'localhost',
  host     : '113.198.81.98',
  port : '80',
  user     : 'root',
  password : '1234',
  database : 'shop'
});
conn.connect();

app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next) {
  if(req.user){
    res.locals.session = req.user;
  }else{
    res.locals.session = 'null';
  }
  console.dir(req.user);

  next();
});

//routes
var index = require('./routes/index')(conn);
var users = require('./routes/users')(conn);
var login = require('./routes/local_login')(hasher,conn,session,passport);
var admin = require('./routes/admin')(app,conn);
var product = require('./routes/product')(conn);

app.locals.pretty = true;//jade가 웹에서 html 코드가 보기좋게 된다.
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/p',express.static('image'));

app.use('/', index);
app.use('/user', users);
app.use('/local', login);
app.use('/admin',admin);
app.use('/product',product);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('sss');
});
