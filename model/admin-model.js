const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    // image:{
    //     type:String,
    //     required:true
    // }, 
    admin:{
        type:Number,
        required:true
    },
    is_verified:{
        type:Number,
        default:0
    }


});
module.exports=mongoose.model('Admin',userSchema)