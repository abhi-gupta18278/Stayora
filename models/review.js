const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//create review schema for save review
const reviewSchema = new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
        default:3,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
})
module.exports = mongoose.model('review',reviewSchema)