// var express = require('express');
// var router = express.Router();
//    router.get("/",function(req,res){
//      console.log('ttttt');
//     res.send('hi');
//      });
//
// module.exports = router;
module.exports = function (hasher,conn,session,passport){
  var express = require('express');
  var LocalStrategy = require('passport-local').Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy; // facebook 인증 Strategy

  var router = express.Router();

  // passport.use(new FacebookStrategy({
  //     clientID: FACEBOOK_APP_ID,
  //     clientSecret: FACEBOOK_APP_SECRET,
  //     callbackURL: "http://localhost:3000/auth/facebook/callback",
  //     profileFields: ['id','email','gender','link','locale','name','timezone','updated_time','verified','displayName'] //profile에 다음과 같은 항목을 보여주고싶을때 추가해야한다. scope에 추가한 항목이 이 안에 없으면 추가해줘야 profile에 나타난다.
  //   },
  //   function(accessToken, refreshToken, profile, cb) {
  //     var authid = 'facebook:' +profile.id;
  //     var sql = 'select *from user where authid=?';
  //     conn.query(sql,[authid],function(err,rows,fields){
  //     if(rows.length>0){ //사용자가 있다면
  //        done(null,results[0]);
  //     }else{  //사용자가 없다면
  //         var sql = 'insert into user set ?';
  //         var newUser = {
  //           'authId' : authid,
  //           'displayname': profile.displayName,
  //         };
  //
  //   }});

  passport.serializeUser(function(user, done) {
    console.log(user.username);
    done(null, user.username);
  });

  passport.deserializeUser(function(id, done) {
    var sql = "select *from users where username = ?";
    conn.query(sql,[id],function(err,rows){
      if(err){
        console.log(err);
      }else{
        done(null,rows[0]);
      }
    });

  });

  router.get("/login",function(req,res){
    res.render('login');
  });

  router.get("/logout",function(req,res){
     req.logout();
     req.session.save(function(){
           res.redirect('/');
     });
  });

  router.get("/signUp",function(req,res){
      res.render('signUp');
  });

  router.post("/signUp",function(req,res){
      var username = req.body.username;
      var password = req.body.password;
      var authid = 'local';
      var displayname = req.body.displayname;
      var phoneNumber = req.body.phoneNumber;
      var email = req.body.email;


      hasher({'password' : password}, function(err, pass, salt, hash) {

          var user = {
            username : username,
            password : hash,
            authid : authid,
            displayname : displayname,
            phoneNumber : phoneNumber,
            email : email,
            salt : salt
          };
          var sql = 'insert into users set ?';
          conn.query(sql,[user],function(err,rows){
            if(err){
                console.log(err);
            }else{
                res.send('success');
            }
          });

      });
  });

  router.post("/usernameCheck",function(req,res){
      var username = req.body.username;
      var sql = 'select count(*) as count from users where username = ?';

      conn.query(sql,[username],function(err,rows){

              if(rows[0].count>0){
                  res.send('reject');
              }else{
                  res.send('permit');
              }
      });
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log('들어옴');
        var id = username;
        var pw = password;
        var sql = 'select *from users where username = ?';
        conn.query(sql,[id],function(err,rows){
                if(err){
                    return done('사용자를 찾을수 없습니다.');
                }
                if(rows[0]){
                  hasher({password:pw,salt:rows[0].salt},function(err, pass, salt, hash){
                      if(hash === rows[0].password)
                      {
                            done(null,rows[0]);
                      }else{
                            done(null,false);
                      }
                  });
                }
                else{
                  return done (null,false);
                }
              });
            }));

  router.post('/login',
    passport.authenticate('local', { successRedirect: '/',
                                     failureRedirect: '/local/login',
                                     failureFlash: false })
  );

  // router.get('/auth/facebook',
  // passport.authenticate('facebook'));
  //
  // router.get('/auth/facebook/callback',
  //   passport.authenticate('facebook', { failureRedirect: '/local/login' }),
  //   function(req, res) {
  //     res.redirect('/');
  //   });


  return router;
};
