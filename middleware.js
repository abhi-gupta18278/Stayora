const Listing = require("./models/listing");
const review = require("./controllers/reviews.js");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/expressError");
const Review = require("./models/review.js");


//check the user login or not 
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        // console.log(req)
        req.session.redirectUrl = req.originalUrl;
        const redirectRouteUrl =req.session.redirectUrl
        // console.log(redirectRouteUrl)
        req.flash('error',"Login the Page for perform this operation")
        return res.redirect("/login")
    }
    next();
}
// save the url which request was send
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl =req.session.redirectUrl ;
    }
    next();
} 

//checking the owner of the listing
module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!res.locals.currentUser || !listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You have not permission to Access this listing")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

//check the author or owner of the review 
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    try {
        const review = await Review.findById(reviewId);

        if (!review) {
            req.flash('error', 'Review not found!');
            return res.redirect(`/listings/${id}`);
        }

        if (!res.locals.currentUser || !review.author.equals(res.locals.currentUser._id)) {
            req.flash('error', 'You are not the author of this review.');
            return res.redirect(`/listings/${id}`);
        }

        // Proceed if the user is the author of the review
        return next();
    } catch (err) {
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect(`/listings/${id}`);
    }
};
// for check the listing is validate or not
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// for check the review is validate or not

module.exports.validateReview = (req, res, next) => {
    let { error,value } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
        req.body = value;
      next();
    }
  };
