const mongoose = require('mongoose')
const initData = require('./data.js')
const Listing = require('../models/listing.js')

//making connection with the mongo dataBase
async function main() {
    await mongoose.connect('mongodb://127.0.0.1/wanderlust');
}
main()
    .then(() => console.log('db connect successfully '))
    .catch((err) => { console.log(err) })

// intilize the database
async function initDB() {
    await Listing.deleteMany({})
    initData.data = initData.data.map((obj) => ({ ...obj, owner: '6805ef9fee718c14fcf86ed4' }))
    await Listing.insertMany(initData.data)
    console.log('data saved successfully')
}
initDB();