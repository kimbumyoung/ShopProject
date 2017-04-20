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
  var router = express.Router();

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

  // router.post("/login",function(req,res){
  //   if(req.session.user){
  //     res.send('Already Login user');
  //   }else{
  //     var username = req.body.username;
  //     var password = req.body.password;
  //     var sql = 'select *from users where username = ?';
  //     conn.query(sql,[username],function(err,rows){
  //       if(err){
  //         console.log(err);
  //       }else{
  //         hasher({password:password,salt:rows[0].salt},function(err, pass, salt, hash){
  //             if(hash === rows[0].password)
  //             {
  //                 req.session.user = username;
  //                 res.redirect('/');
  //             }else{
  //                 res.redirect('/local/login');
  //             }
  //         });
  //
  //       }
  //     });
  //   }
  // });

  router.get("/signUp",function(req,res){

      res.render('signUp');

  });

  router.post("/signUp",function(req,res){
      var username = req.body.username;
      var password = req.body.password;
      var displayname = req.body.displayname;

      hasher({'password' : password}, function(err, pass, salt, hash) {

          var user = {
            username : req.body.username,
            password : hash,
            displayname : req.body.displayname,
            salt : salt
          };
          var sql = 'insert into users set ?';
          conn.query(sql,[user],function(err,rows){
            if(err){
                console.log(err);
            }else{
                res.redirect('/local/login');
            }
          });

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

        //     var password = req.body.password;
        //     var sql = 'select *from users where username = ?';
        //     conn.query(sql,[username],function(err,rows){
        //       if(err){
        //         console.log(err);
        //       }else{
        //         hasher({password:password,salt:rows[0].salt},function(err, pass, salt, hash){
        //             if(hash === rows[0].password)
        //             {
        //                 req.session.user = username;
        //                 res.redirect('/');
        //             }else{
        //                 res.redirect('/local/login');
        //             }
        //         });

  router.post('/login',
    passport.authenticate('local', { successRedirect: '/',
                                     failureRedirect: '/local/login',
                                     failureFlash: false })
  );


  return router;
};
