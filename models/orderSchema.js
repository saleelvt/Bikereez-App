

const mongoose = require('mongoose')
const { Schema } = mongoose


const shippedAddressSchema = new Schema({
    Name: { type: String, required: true },
    AddressLane: { type: String, required: true },
    Pincode: { type: Number, required: true },
    City: { type: String, required: true },
    State: { type: String, required: true },
    Mobile: { type: Number, required: true },
})


const ordersSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: "Order Placed" },
    items: [{
        productId: { type: Schema.Types.ObjectId, ref: "Products" },
        quantity: { type: Number },
    }],
    paymentMethod: { type: String },
    orderDate: { type: Date },
    deliveryDate:{type:Date},
    totalAmount: { type: Number },
    totalQuantity:{type:Number},
    paymentStatus: { type: String, default: "Pending" },
    address:{type: shippedAddressSchema},
    userReason:{type:String,default:"Not Applicable"},
    returnDate:{type:Date,default:null},
    adminReason:{type:String,default:"Not Applicable"},
    approvedDate:{type:Date,default:null},
    rejectedDate:{type:Date,default:null},
    returnStatus:{type:String,default:"None"},
    couponDiscount:{type:Number,default:0}
})

const orders = mongoose.model('Orders', ordersSchema)

module.exports = orders