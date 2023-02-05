const passport = require("passport");
const LocalStrategy  = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
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

passport.use(new GoogleStrategy({
    clientID:"861353967699-kio538nlg8mve7pursnk53h84h99o118.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:8000/auth/google/redirect",
},(accessToken,refreshToken,profile,done)=>{
    const {name,email} = profile._json;
    User.findOne({email})
        .then(user=>{
            if(user){
                return done(null,user);
            }
            User.create({
                email,
                strategy:"GOOGLE"
            })
            .then(newUser=>{
                console.log(newUser);
                done(null,newUser);
            })
            .catch(err=>{
                console.log(err);
            })
        }) 
        .catch(err=>{
            console.log(err);
            done(err);
        })
    // console.log("Profile of user",profile._json,"\n\n\n");
}))

passport.serializeUser((user,done)=>{
    console.log("In serializeUser");
    console.log(user);
    console.log("____________");
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