const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const review = require('./review.js')

//create the listing schema 
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url:String,
        filename:String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'review',
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
}
)

listingSchema.post("findOneAndDelete", async (listing) => {
    await review.deleteMany({ _id: { $in: listing.reviews } })
})
const Listing = mongoose.model('Listing', listingSchema)
module.exports = Listing;