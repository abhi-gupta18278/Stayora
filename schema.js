const Joi = require('joi')
//using joi validate the listing schema
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
      country: Joi.string().required(),
      price: Joi.number().required().min(0),
      image: Joi.string().allow("", null), // Optional: can be empty string or null
    }).required(),
  });

  
//using joi validate the reveiw schema
  module.exports.reviewSchema = Joi.object({
    review: Joi.object({
      rating: Joi.number().min(1).max(5).default(3),
      comment: Joi.string().required(),
    }).required(),
  });
  