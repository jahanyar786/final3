var express = require("express");
var app = express();
const path = require('path');
const multer = require("multer");

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}


app.get("/blog", function(req,res){
    res.sendFile(path.join(__dirname,"blog.html"));
  });

app.get("/login", function(req,res){
    res.sendFile(path.join(__dirname,"login.html"));

  });


app.get("/registration", function(req,res){
    res.sendFile(path.join(__dirname,"registration.html"));

    /*res.render("Registration", {
      layout:false

    })*/
  });

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"home.html"));
});

app.use(express.static("public"));

app.post("/registerAcc", (req, res) =>{
  const {name, email, password, passwordConf} = req.body;

  let nameNull = false;
  let emailErrMess = "";
  let passErrMess = "";
  let rePassErrMess = "";

  if(name == "") { nameNull = true; }

  if(email == "") { 
      emailErrMess = "Enter your Email";
  } else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      emailErrMess = "Email not Valid";
  }

  if(password == "") { 
      passErrMess = "Enter a Password"; 
  } else {
      if(!/[a-z]/g.test(password)) {
          passErrMess += "Password must have a lowercase charactor";
      }

      if(!/[A-Z]/g.test(password)) {
          if(passErrMess == "") {
              passErrMess += "Password must have an uppercase charactor";
          } else {
              passErrMess += ", an uppercase charactor";
          }
      }

      if(!/[0-9]/g.test(password)) {
          if(passErrMess == "") {
              passErrMess += "Password must have a numeric value";
          } else {
              passErrMess += ", a numeric value";
          }
      }

      if(!/[a-zA-Z0-9]{8,}/g.test(password)) {
          if(passErrMess == "") {
              passErrMess += "Password must be a 8 charactors or longer, without spaces";
          } else {
              passErrMess += ", and be 8 charactors or longer, without spaces";
          }
      }
  }

  if(passwordConf == "") { 
      rePassErrMess = "Re enter your Password";
  } else if (password != passwordConf){
      rePassErrMess = "Passwords much match";
  }

  if(!nameNull && emailErrMess == "" && passErrMess == "" && rePassErrMess == "") {
      const mail = {
          to: email,
          from: `karuldas1@myseneca.ca`,
          subject: `Thank you for creating an Amazon account`,
          html: `<strong>Welcome ${name} to Amazon, Where products are unreal.</strong>`
      };

      mailSender.send(mail).then(() => {
          logedIn = true;
          userEmail = email;

          // tempUser = {
          //     name: name,
          //     email: email,
          //     password: password
          // }
          // data.addUser(tempUser);
          
          // res.redirect("/accHome");
          res.render("acc", {
              title: "Account",
              summary: true,
              orders: false,
              name: name
          });
      }).catch(err => {
          console.log(`Error ${err}`);
      });
  } else {
      res.render("login", {
          title:"Create Account",
          logInMode: false,
          nameVal: name,
          emailVal: email,
          passVal: password,
          rePassVal: passwordConf,
          nameErr: nameNull,
          emailErr: emailErrMess,
          passErr: passErrMess,
          rePassErr: rePassErrMess
      });
  }
});


// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);