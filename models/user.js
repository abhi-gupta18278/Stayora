const express = require('express')
const mongoose = require("mongoose")
const { required } = require('joi')
const app = express()
const passportLocalMongoose = require('passport-local-mongoose')
//user login Schema
const userSchema = new mongoose.Schema ({
    email:{
        type:String,
        required:true,
    },
})
//passport will be passportLocalMongooses

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User",userSchema)