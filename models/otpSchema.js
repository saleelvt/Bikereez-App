const mongoose=require('mongoose')
const OTPSchema=new mongoose.Schema({
    Email:{
        type:String,
        unique:true
    },
    otp:{
        type:Number
    },createdAt:{
        type:Date
    },
    expiresAt:{
        type:Date
    }
})
const OTP=mongoose.model('OTP',OTPSchema)
module.exports=OTP