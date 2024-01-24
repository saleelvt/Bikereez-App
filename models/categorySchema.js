
const mongoose=require('mongoose')

const CategoriesSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true,
        unique:true,
        uppercase:true
    },
    status:{
        type:String,
        default:'Active',
        required:true
    }
 
})
const Categories=mongoose.model('Categories',CategoriesSchema)
module.exports=Categories