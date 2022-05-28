//jshint esversion:6

// using dotenv
require('dotenv').config();

const express =  require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

// Create new mongoose schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save(function(err){
    if(!err) {
      console.log("Successfully saved new user.");
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = md5(req.body.password);
  User.findOne({email: username}, function(err, result){
    if(!err){
      if(result) {
        if(result.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});



app.listen(8080, function(){
  console.log("Server started at port 8080");
});
