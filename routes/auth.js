const router = require("express").Router();

const passport = require("../config/passport");

const {getSignIn,postSignIn,postGoogle,getSignup,postSignup,getLogout,resetPassword} = require("../controller/auth");

router.get("/signin",getSignIn);

router.post("/signin",passport.authenticate("local",{failureRedirect:"/auth/login"}),postSignIn);

router.use("/google/redirect",passport.authenticate("google",{failureRedirect:"/fail"}),postGoogle);

router.get("/google",passport.authenticate("google",{scope:["profile","email"]}));


router.get("/signup",getSignup);

router.post("/signup",postSignup);

router.get("/logout",getLogout)

router.post("/reset-password",resetPassword)



module.exports = router;