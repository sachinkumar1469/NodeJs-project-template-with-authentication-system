const router = require("express").Router();
const path = require("path");

const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("../config/passport");

router.get("/signin",(req,res,next)=>{
    res.render(path.join(__dirname,"..","views","signin"));
})

router.post("/signin",passport.authenticate("local",{failureRedirect:"/auth/login"}),(req,res,next)=>{
    // console.log(req.user);
    // console.log(req.isAuthenticated());
    res.redirect("/");
})

router.get("/signup",(req,res,next)=>{
    res.render(path.join(__dirname,"..","views","signup"));
})

router.post("/signup",(req,res,next)=>{
    console.log("here");
    console.log(req.body);
    const {email,password,confirmPassword} = req.body;
    if(password!==confirmPassword){
        return res.redirect("back");
    }

    User.findOne({email})
    .then(user=>{
        if(!!user){
            return res.redirect("/auth/signin");
        }
        bcrypt.hash(password,12)
            .then(hashedPassword=>{
                return User.create({
                    email,
                    password:hashedPassword
                })
            })
            .then(user=>{
                console.log(user);
                return res.redirect("/auth/signin");
            })
            .catch(err=>{
                console.log("Unable to hash");
            })
        
    })
    .catch(err=>{
        console.log(err);
        
    })
})

module.exports = router;