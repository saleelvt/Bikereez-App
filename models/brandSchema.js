const mongoose = require('mongoose');

const BrandSchema =new mongoose.Schema({
    Name:{
        type:String,
        required: true,
        unique: true,
        uppercase: true
    },
    status:{
        type:String,
        default:'Active',
        required:true
    }
})


const Brand = mongoose.model('brand', BrandSchema);

module.exports = Brand