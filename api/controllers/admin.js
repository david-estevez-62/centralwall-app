

var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "Aol",
  auth: {
      user: "canvastestprogram@aol.com",
      pass: "secret27-"
  }
});



var mailOptions = {
  from: "Eric <canvastestprogram@aol.com>",
  subject: "Canvas App - Email verification"
}



var User = require("../models/users");



var performLogin = function (req, res, next, user) {
  // Passport injects functionality into the express ecosystem,
  // so we are able to call req.login and pass the user we want
  // logged in.

  req.login(user, function (err) {

    if (err) return next(err);

    // There are 259200000 milliseconds in 3 days, if its within that timeframe we are going
    // to say the cookie is active otherwise it has expired
    return res.end( JSON.stringify({ user: { email: user.email, id: user._id + "-" + (parseInt(new Date().getTime()) + 259200000) }}));
  });
};




module.exports = function(app, passport){



  app.post("/signin", function (req, res, next) {
      // Passport's "authenticate" method returns a method, so we store it
      // in a variable and call it with the proper arguments afterwards.
      // We are using the "local" strategy defined in the passport.js file
      var authFunction = passport.authenticate("localSignIn", function(err, user, report){


        if(err) return next(err);

        if(!user){

          return res.send({ info: report.info });
        }

        // If we make it this far, the user has correctly authenticated with passport
        // so now, we'll just log the user into the system.
        performLogin(req, res, next, user);
      });


      // Now that we have the authentication method created, we'll call it here.
      authFunction(req, res, next);

  });



  app.post("/signup", function(req, res, next){


      User.findOne({email: req.body.username}, function(err, user){

        if(err) return next(err);

        // The case when a user is returned from querying the database means a user with that
        // username already exists in the database. Respond with the "email is already in the
        // system"
        if(user) {
            return res.end( JSON.stringify({ info : "That email is already in the system." }) );
        } else {

          
          var user = new User({
            email: req.body.username,
            password: req.body.password
          });

          user.save(
              function(err, user){


                  if(err) {
                    return res.end( JSON.stringify({ info : "An error occured in saving, please try again. Sorry for the inconvenience" }) );
                  }

                  mailOptions.to = req.body.username;
                  mailOptions.text = "Confirm your account and you will be redirected to the Canvas webpage to log on: http://"+req.headers.host+"/code/"+user._id+"/"+req.headers.origin.substr(7);



                  transporter.sendMail(mailOptions, function(err, specs) {
                      if(!err){ console.log("Email sent") }

                      return res.end( JSON.stringify({ info : "An email verification has been sent." }) );

                  });
              })


        }
      })

  
  })



};
