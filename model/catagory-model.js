const mongoose=require('mongoose')
const catagorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    status:{
        type:Boolean,
        default:true

        
    },
},
    {
        timestamps:true
    
});
module.exports=mongoose.model("Category",catagorySchema);