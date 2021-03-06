const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const mongoose = require("mongoose");
const passport = require("passport");
//strategy that allows us to auth with user/pass
const localStrategy = require("passport-local");
//PLM allows us to use passport local strategy with mongoose as a library to store in MongoDB
const passportLocalMongoose = require("passport-local-mongoose");

app.use(express.json());
app.use(express.urlencoded());

mongoose.connect(
  'mongodb://accadmin:acc_rocks_2020@mongo.accsoftwarebootcamp.com_27017/zv_passport',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

// mongoose.connect("mongodb://mongo.accsoftwarebootcamp.com/zv_passport", 
// {
//   User: "accadmin",
//   pass: "acc_rocks_2020",
//   auth: {
//       authSource: "admin"
//   },
//   useNewUrlParser: true,
//   useUnifiedTopology: true 
// })


// mongoose.connect(
//   connstr,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   },
//   function(err){
//     if(err) {console.log(err)}
//     console.log(`connected to mongo at: ${connstr}`)
//   }
// )

// mongoose.connect("mongodb://localhost/27017/zv_passport-local-demo",{
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })

const UserModel = require("./models/user")

// load session middleware in the app object
app.use(require('express-session')({
  secret: "blah blah blah",   // used to encrypt the user session info befores saving to db
  resave: false,              // save the session obj even if not changed
  saveUninitialized: false    // save the session obj even if not initialized
}));

// generating middleware functions from passport core library
app.use(passport.initialize());
// generating middleware functions from session core library, and loading to the app
app.use(passport.session());
// loading authentication functions, and local strategy to our passport object
passport.use(new localStrategy(UserModel.authenticate()));
// load the functions to save to db, into the passport object
passport.serializeUser(UserModel.serializeUser());
// load the functions to read from db, into the passport object
passport.deserializeUser(UserModel.deserializeUser());



app.get('/', function(req,res){
  res.render('home.ejs');
});

app.get('/newsfeed', isLoggedIn, function(req,res){
  res.render('newsfeed.ejs');
});

app.get('/signup', function(req,res){
  res.render('signup.ejs');
})

app.get('/login', function(req,res){
  res.render('login.ejs');
})

app.get('/logout', function(req,res){
  res.render('logout.ejs');
})

app.post("/signup", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.render("signup.ejs")
      } else {
          passport.authenticate("local")(req, res, function(){
              res.redirect("/newsfeed");
          });
      }
  })
});

app.post("/login", passport.authenticate('local',
  {
    successRedirect:'/',
    failureRedirect:'/'
  }
)



app.listen(PORT, function() {
  console.log(`app.js running on ${PORT}`);
})


function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  
}