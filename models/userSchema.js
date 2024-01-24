
const mongoose = require('mongoose')
const { Schema, ObjectId } = mongoose
// Define the User schema 
const UserSchema = new Schema({
    Username: {
        type: String,
        uppercase: true,
        required: true
    }, Email: {
        type: String,
        required: true
    },
    Password: {

    },
    Status: {
        type: String,
        default: 'Active'
    },
    Address: [{
        Name: {
            type: String
        },
        AddressLane: {
            type: String
        },
        City: {
            type: String
        },
        Pincode: {
            type: Number
        },
        State: {
            type: String
        },
        Mobile: {
            type: Number
        }
    }],
    usedCoupons: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' }], default: [] },
    
    Wishlist:[{
        productId:{type:Schema.Types.ObjectId,ref:'Products'}
    }],
    ReferedAmount: {
        type: Number,
        default: 0
      },
      ReferredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      referredUsers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],

});
// Create a User model based on the UserSchema
const User = mongoose.model('User', UserSchema);
module.exports = User;