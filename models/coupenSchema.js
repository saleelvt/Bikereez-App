


const mongoose=require('mongoose');

const couponSchema=new mongoose.Schema({

    couponCode:{
        type:String,
        required:true,
        unique:true
    },

    discount:{
        type:Number,
        required:true
    },
    valid_from:{
        type:Date,
        required:true
    },
    valid_to:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        default:"Active",
        required:true
    },
    
})
const Coupon= mongoose.model('Coupon',couponSchema)
module.exports=Coupon