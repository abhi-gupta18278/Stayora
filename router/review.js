const express = require('express')
const router = express.Router({mergeParams:true})
const controllerReview = require('../controllers/reviews.js')
const wrapasync = require('../utils/wrapasync.js')
const { validateReview, isLoggedIn,isLoggedInReview, isReviewAuthor } = require('../middleware.js')

//post the review 
router.post('/',isLoggedInReview, validateReview,wrapasync(controllerReview.createNewReview))
//delete the review in the post
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapasync(controllerReview.destroyReview))

module.exports = router; 