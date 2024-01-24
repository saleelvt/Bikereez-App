const mongoose = require('mongoose')
const { Schema, objectId } = mongoose
const ProducteSchema = new mongoose.Schema({

  ProductName: {
    type: String,
    required: true,
    uppercase: true
  },
  Description: {
    type: String,
    required: true,
  },
  BrandName: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'brand'
  },
  images: {
    type: Array,
    required: true,
  },
  AvailableQuantity: {
    type: Number,
    validate: {
      validator: function (value) {
        return value >= 0; // Validates that Quantity is greater than 0
      },
      message: "Quantity Can't be less than 0"
    }
  },
  Category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Categories'
  },
  Price: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return value > 0; // Ensuring Price is a positive number
      },
      message: 'Price must be a positive number.'
    }

  },
  DiscountAmount: {
    type: Number,
    validate: {
      validator: function (value) {
        return value >= 0 && value <= this.Price; // Ensuring DiscountAmount is positive and less than or equal to Price
      },
      message: 'Discount amount must be a positive number and less than the Price.'
    }
  },
  OfferPrice:{
    type:Number,
    default:0
  },
  OfferDiscount:{
    type:Number,
    default:0
  },
  Status: {
    type: String,
    required: true,
  },
  Variation: {
    type: String,
  },
  ProductType: {
    type: String,
  },
  UpdatedOn: {
    type: String
  },
  Display: {
    type: String,
    required: true

  },
  Specification1: {
    type: String
  },
  deletedAt: {
    type: Date
  },
  IsInOffer: {
    type: Boolean,
    default: false,
  },

})

const Products = mongoose.model('Products', ProducteSchema)
module.exports = Products