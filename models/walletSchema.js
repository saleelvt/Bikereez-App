const mongoose = require("mongoose")
const { Schema, OjectId } = mongoose

const walletSchema = new mongoose.Schema({

    userId: { type: Schema.Types.ObjectId, ref: "User" },

    orders: { type: Schema.Types.ObjectId, ref: "Orders" },

    totalAmount: { type: Number },
 
    status: { type: String, default: "Credit" }

})
const wallet = mongoose.model('Wallet',walletSchema)
module.exports = wallet