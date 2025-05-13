const User = require('../models/user.js')

//signup  in the form
module.exports.signup =async (req, res,next) => {
    try {
        let { email, username, password } = req.body;
        let newUser = new User({ email, username })
        let newRegister = await User.register(newUser, password)
        // console.log(newRegister);
        req.login(newRegister,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success", "user Register successfully. Welcome the Wanderlust")
            res.redirect('/listings')
        })
    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/signup')
    }
}

//login  form action 
module.exports.login =   async (req, res) => {

    req.flash('success', " Welcome the Page! Logging Successfull")
    let redirectUrl = res.locals.redirectUrl  || "/listings";
    res.redirect(redirectUrl)
}

//logout functionality
module.exports.logout =(req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "You are logged out!")
        res.redirect('/listings')
    })
}
