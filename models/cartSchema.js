const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;



const cartSchema = new mongoose.Schema({

    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Products',

        },  
        quantity: {
            type: Number,
        },

    }
    ],
    totalAmount: {
        type: Number,
      },
      coupons:[{    
      }]
})

const Cart=mongoose.model('Cart',cartSchema)

module.exports=Cart