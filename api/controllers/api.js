
var fs = require("fs"),
base64Img = require("base64-img");


var User = require("../models/users.js");




module.exports = function(app) {



    // route to get static imgs and post cookie to check if user should still be logged in
    app.post("/bootstrapclient", function(req, res, next){
          fs.readdir("public/img/uploads", function(error, pics) {

            var imgs = [];

          if (error) return next(error);

            // Don't use the results returned by readdir (in this case I call it pics) because 
            // could have hidden .files such as DS Store so populate a different variable
            for (var i = 0; i < pics.length; i++) {
              if(pics[i].substr(-4) === ".png"){
                imgs.push("http://" + req.headers.host + "/img/uploads/" + pics[i]);
              }
            }



          var cookie = req.body.cookie;



          User.findById(cookie.substr(0, 24), function(err, user){

            var objResp;


            if(!user){

              objResp = { imgs: imgs, notformat: true };

              // Check to see if the current date is greater then the date portion attached to the 
              // cookie. If it is then the cookie has expired send an expired property
            } else if( parseInt(cookie.substr(25)) <  (new Date().getTime()) ){

              objResp = { imgs: imgs, expired: true  };

            } else{
              // The cookie is associated with a user in the database if here. And has not expired yet.
              // The properties we need to send to the client are the verified and the email properties. 
              // An additional check is done on the client to make sure the account is verified not 
              // enough to just check if user is in the database because we do not want to give access to 
              // an unverified account. The email property will be used for the username displayed in 
              // the header
              objResp = { imgs: imgs, user: { email: user.email, verified: user.verified }};
            }


            return res.send(objResp);

          });



        });
    });






    // route to get static imgs and post cookie to check if user should still be logged in
    app.post("/staticpics", function(req, res) {

      fs.readdir("public/img/uploads", function(error, pics){

        var imgs = [];

        if (error) return next(error);

          // Don't use the results returned by readdir (in this case I call it pics) because 
          // could have hidden .files such as DS Store so populate a different variable
          for (var i = 0; i < pics.length; i++) {
            if(pics[i].substr(-4) === ".png"){
              imgs.push("http://" + req.headers.host + "/img/uploads/" + pics[i]);
            }
          }


          var cookie = req.body.cookie;



          User.findById(cookie.substr(0, 24), function(err, user){

            var objResp;



            if(!user){
              objResp = { imgs: imgs, notformat: true };

              // Check to see if the current date is greater then the date portion attached to the 
              // cookie. If it is then the cookie has expired send an expired property
            } else if( parseInt(cookie.substr(25)) <  (new Date().getTime()) ){

              objResp = { imgs: imgs, expired: true  };

            } else {
              // The cookie is associated with a user in the database if here. And has not expired yet.
              // The properties we need to send to the client are the verified and the email properties. 
              // An additional check is done on the client to make sure the account is verified not 
              // enough to just check if user is in the database because we do not want to give access to 
              // an unverified account. The email property will be used for the username displayed in 
              // the header
              objResp = { imgs: imgs, user: { email: user.email, verified: user.verified }};

            }


            return res.send(objResp);

          })



      });

    });






    app.get("/code/:token/:origin", function(req, res) {

      User.findById(req.params.token, function(err, user) {

        var infoMsg;
        // If the user has already been verified there is no point in saving again if the user associated 
        // with the unique secret token clicks the link again
        if(user && !user.verified){
          user.verified = true;
          user.save();

          return res.redirect("http://" + req.params.origin);

        } else if(user){
          infoMsg = "That account has already been verified.";
        } else {
          infoMsg = "That link is not for a valid account.";
        }

          return res.end(infoMsg)
      }); 

    });






    app.post("/adjoinimg", function(req, res) {

        var cookie = req.body.cookie;



        User.findById(cookie.substr(0, 24), function(err, user){

          var objResp;



          if(!user){

            return res.send({ notformat: true });


            // Check to see if the current date is greater then the date portion attached to the 
            // cookie. If it is then the cookie has expired send an expired property
          } else if( parseInt(cookie.substr(25))  <  (new Date().getTime()) ){

            return res.send({ expired: true  });

          } else {
            // The cookie is associated with a user in the database if here. And has not expired yet. 
            // The only user property we look for on client in response to this route is the verified
            // property so that is the only property we need to send in the response
            if(user.verified) {
              // Convert the dataUrl posted to a png image and save to an uploads folder
              base64Img.img(req.body.dataUrl, "./public/img/uploads/", String(new Date().getTime()), function(err, filepath) {
                
                return res.send({ user: { verified: user.verified } });

              });
            }else{

                return res.send({ user: { verified: user.verified } });
            
            }

          }
        })



    });






    // This route is only for the route tests. In order to test the specific case of the routes when the given
    // cookie corresponds to a user in the database we need to grab any (existing) user that is in the local 
    // mongo database to get an id produced in that instance of mongodb in order to create a valid cookie for the
    // tests of certain routes
    app.get("/getexistinguser", function(req, res){
        User.findOne().exec(function(err, user) {
          res.send(user._id);
        })
    });





};


