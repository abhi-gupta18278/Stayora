const Listing = require("../models/listing");
const ExpressError = require("../utils/expressError");


//index route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('./listings/index.ejs', { allListings })
}
// new listings
module.exports.newListing = async (req, res) => {
    res.render('./listings/new.ejs')
}
// post new listing 
module.exports.postNewListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing)
    if (!req.body.listing) {
        throw new ExpressError(400, 'Send Valid data for listing')
    }
    newListing.owner = req.user._id;
    newListing.image = { url, filename }
    await newListing.save()
    req.flash('success', 'Your New Listing Saved!')
    res.redirect('/listings')

}
//show listing
module.exports.showListings = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews", populate: {
            path: "author"
        }
    }).populate("owner");
    if (!listing) {
        req.flash('error', 'Your Listing does not exist!')
        res.redirect("/listings")
    }
    res.render('./listings/show.ejs', { listing })
}

//delete listings
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Your Listing Successfully deleted!')
    // console.log(deleltListing);
    res.redirect('/listings')
}

//edit listings route
module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    if (!listing) {
        req.flash('error', 'Your Listing does not exist!')
        res.redirect("/listings")
    }
    let OrginalImageUrl = listing.image.url;
    
    OrginalImageUrl = OrginalImageUrl.replace('/upload','/upload/h_300,w_250')
    res.render('./listings/edit.ejs', { listing,OrginalImageUrl })
}
//update listings
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename }
    await listing.save();
    }
    req.flash('success', 'Your Listing Successfully Updated!')
    res.redirect(`/listings/${id}`)
}
