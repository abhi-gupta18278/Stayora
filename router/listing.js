const express = require('express')
const router = express.Router()
const { listingSchema } = require('../schema.js')
const ExpressError = require("../utils/expressError.js")
const wrapasync = require('../utils/wrapasync.js')
const controllerListing = require('../controllers/listing.js')
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js')

// using the multer 
const multer = require('multer')
const {storage} = require('../cloudinery.js')
const upload = multer({storage})

//here we can create the router.route
router.route("/").get(wrapasync(controllerListing.index))
.post(isLoggedIn, validateListing ,upload.single("listing[image]"), wrapasync(controllerListing.postNewListing))

//create new route
router.get('/new',isLoggedIn, wrapasync(controllerListing.newListing))

// create route for the show delete 
router.route('/:id').get(wrapasync(controllerListing.showListings))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapasync(controllerListing.updateListing))
.delete(isLoggedIn,isOwner, wrapasync(controllerListing.deleteListing))


//edit the lisitng
router.get('/:id/edit',isLoggedIn,isOwner, wrapasync(controllerListing.editListing))


module.exports = router;