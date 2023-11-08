const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        require:true
    },
    admin:{
        type:Number,
        require:true
    },
    status:{
        type:Boolean,
        require:true
    },
    access:{
        type:Boolean,
        default:true
    },
    address:[{
        name:{
            type:String, 
        },
        address:{
            type:String,
        
        },
        pin:{
            type:Number,
        
        },
        country:{
            type:String,
        
        },
        state:{
            type:String,
        
        },
        city:{
            type:String,
        
        },
        mob:{
            type:Number,
            
        },
        status:{type:Boolean,default:false}
    }],
    walletAmount:{
        type:Number,
        default:0
    },
    wallethistory:[{
            tdate:{type:Date},
            amount:{type:Number,default:0},
            sign:{type:String}
}]

    

});
module.exports=mongoose.model("User",userSchema)