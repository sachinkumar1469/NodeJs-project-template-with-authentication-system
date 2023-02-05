const router = require("express").Router();
const path = require("path");

const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("../config/passport");

router.get("/signin",(req,res,next)=>{
    console.log("In first signin");
    res.render(path.join(__dirname,"..","views","signin"));
})

router.post("/signin",passport.authenticate("local",{failureRedirect:"/auth/login"}),(req,res,next)=>{
    // console.log(req.user);
    // console.log(req.isAuthenticated());
    res.redirect("/");
})

router.use("/google/redirect",passport.authenticate("google",{failureRedirect:"/fail"}),(req,res,next)=>{
    console.log("Here");
    res.redirect("/");
})

router.get("/google",passport.authenticate("google",{scope:["profile","email"]}));


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
                    password:hashedPassword,
                    strategy:"LOCAL"
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
});

router.get("/logout",(req,res,next)=>{
    req.logout({keepSessionInfo:false},(done)=>{
        res.redirect("/auth/signin");
    })
})

router.post("/reset-password",(req,res,next)=>{
    const {password,confirmPassword} = req.body;
    if(password !== confirmPassword){
        return res.redirect("back");
    }
    console.log(req.user);
    if(req.user.strategy!=="GOOGLE"){
        // req.user.pa
        bcrypt.hash(password,12)
            .then(hashedPass=>{
                req.user.password = hashedPass;
                req.user.save()
                .then(result=>{
                    console.log('result',result);
                    res.redirect("back");
                })
                .catch(err=>{
                    console.log(err);
                })
            })
            .catch(err=>{
                console.log(err);
            })
    } else {
        res.redirect("back");
    }
})



module.exports = router;