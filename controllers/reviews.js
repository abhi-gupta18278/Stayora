const Listing = require("../models/listing")
const Review = require("../models/review.js");


//create new review 
module.exports.createNewReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id;
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    req.flash('success','Your new Review created!')
    res.redirect(`/listings/${listing._id}`);

}

//edit reveiw
module.exports.destroyReview =  async(req,res)=>{
    let {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    req.flash('success','Your Review Successfully deleted!')
    res.redirect(`/listings/${id}`)
}