const express = require('express');
const mongoose = require("mongoose");
const expressSession = require("express-session");

const MongoDBStore = require("connect-mongodb-session")(expressSession);

const passport = require("./config/passport");

const store = new MongoDBStore({
    uri:'mongodb+srv://sachinyadav1469:Sachin%40123@cluster0.my3twen.mongodb.net/auth?retryWrites=true&w=majority',
    collection:'authStore'
})

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://sachinyadav1469:Sachin%40123@cluster0.my3twen.mongodb.net/auth?retryWrites=true&w=majority')
        .then(result=>{
            app.listen(8000);
        })
        .catch(err=>{
            console.log("Unable to connect to db");
        })



app.set('view engine','ejs');
app.set('views','views');

app.use(express.static('public'));

app.use(express.urlencoded({extended:false}));



app.use(expressSession({
    secret:"MySecretKey",
    saveUninitialized:false,
    resave:false,
    store:store
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth",require('./routes/auth'));

app.use("/fail",(req,res,next)=>{
    res.send("Fail");
})

app.use("/",(req,res,next)=>{
    res.render(require("path").join(__dirname,"views","home"));
})

