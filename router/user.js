const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapasync.js')
const passport = require('passport')
const controllerUser = require("../controllers/user.js")
const { saveRedirectUrl } = require('../middleware.js')

//SignUp router
router.route("/signup").get((req, res) => {
    res.render('./user/signup.ejs')
})
.post(wrapAsync(controllerUser.signup))



//Login router
router.route("/login").get( (req, res) => {
    res.render('./user/login.ejs')
})
.post(saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),controllerUser.login)

//logout router
router.get('/logout', controllerUser.logout)

module.exports = router;