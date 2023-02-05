const passport = require("passport");
const LocalStrategy  = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/user");

console.log("Executing Passport.js");

passport.use(new LocalStrategy({
    usernameField:"email",
    passwordField:"password"
},(username,password,done)=>{
    let user = null;
    User.findOne({email:username})
        .then(result=>{
            // console.log(user);
            user = result;
            if(!!!user){
                return done(null,false);
            }
            return bcrypt.compare(password,user.password); 
        })
        .then(isPasswordMatched=>{
            return done(null,user);
        })
        .catch(err=>{
            console.log(err);
        })
}));

passport.serializeUser((user,done)=>{
    console.log("In serializeUser");
    done(null,user._id);
})

passport.deserializeUser((userId,done)=>{
    console.log("In deserialized user");
    User.findById(userId)
        .then(user=>{
            if(!user){
                done(null,false);
            }
            done(null,user);
        })
        .catch(err=>{
            done(err);
        })
})

module.exports = passport;