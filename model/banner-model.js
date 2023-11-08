const mongoose=require('mongoose')
const bannerschema=new mongoose.Schema({
    bannername:{
        type:String,
        required:true
    },
    tittle:{
        type:String
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
      
    },
    url:{
        type:String,
       
    }
})
module.exports=mongoose.model('Banner',bannerschema)
