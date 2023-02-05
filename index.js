const express = require('express');
const mongoose = require("mongoose");
const expressSession = require("express-session");

// To save express session in mongodb 
const MongoDBStore = require("connect-mongodb-session")(expressSession);

// Passport is used for authentication
const passport = require("./config/passport");

// Store configuration
const store = new MongoDBStore({
    uri:'mongodb+srv://sachinyadav1469:Sachin%40123@cluster0.my3twen.mongodb.net/auth?retryWrites=true&w=majority',
    collection:'authStore'
})

// Initalizing App
const app = express();

// Setting Up connection to mongodb atlas server
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://sachinyadav1469:Sachin%40123@cluster0.my3twen.mongodb.net/auth?retryWrites=true&w=majority')
        .then(result=>{
            app.listen(8000);
        })
        .catch(err=>{
            console.log("Unable to connect to db");
        })


// Template engine
app.set('view engine','ejs');
app.set('views','views');

// Statid file routes
app.use(express.static('public'));

// To encode req body
app.use(express.urlencoded({extended:false}));


// Initializing the express session
app.use(expressSession({
    secret:"MySecretKey",
    saveUninitialized:false,
    resave:false,
    store:store
}));

// Initializing the passport js
app.use(passport.initialize());
app.use(passport.session());

// Auth route
app.use("/auth",require('./routes/auth'));

// Auth failure handler
app.use("/fail",(req,res,next)=>{
    res.send("Authentication Failed");
})

// Home page route
app.use("/",(req,res,next)=>{
    res.render(require("path").join(__dirname,"views","home"));
})

