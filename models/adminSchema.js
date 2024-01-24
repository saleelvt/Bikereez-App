const mongoose=require('mongoose')

const Schema=mongoose.Schema
const AdminSchema= new Schema({
    // Name:{
    //     type:String,
    // required:true
    // },
    Email:{
     type:String,
     required:true
    },
    Password:{
        type:String,
        required:true
    },
    Status:{
        type:String,
        default:'Active'
    }
});
const Admin=mongoose.model('admin',AdminSchema)
module.exports=Admin