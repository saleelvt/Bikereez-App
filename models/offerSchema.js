const mongoose=require('mongoose')

const offerSchema= new mongoose.Schema({
    CategoryName:{
        type:String,
        required:true,
        unique: true,
      
    },
    Discount:{
        type:Number,
        required:true,
        validate: {
            validator: function(value) {
                // Your validation logic here
                return value >= 0 && value <= 100;
            },
            message: 'Discount must be between 0 and 100'
        }
    },
    Valid_to:{
        type:Date,
        required:true,
    },
    Valid_from:{
        type:Date,
        required:true
    },
    Status:{
       type:String,
       default:'Active',
       required:true
    }
})

const Offer=mongoose.model('Offer',offerSchema)
module.exports=Offer