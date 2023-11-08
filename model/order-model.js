const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    item:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true
        },
        quantity:{
            type:Number,
            default:1
        },
        price:{
            type:Number,
            default:0
        },
        totalprice:{
            type:Number,
            default:0
        }
    }],
    totalAmount:{
        type:Number,
        default:0
    },
    discount:{
        type:Number,
        default:0
    },
    deliveryCharge:{
        type:Number,
        default:0
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
        // status:{type:Boolean,default:false}
    }],
    paymentType:{
        type:String,
       
    },
    orderStatus:{
        type:String,
        default:"ordered"
    },
    date:{
        type:Date,
    },
    deliveredDate:{
        type:Date
    }
},
{
    timestamps:true
}
)
module.exports=mongoose.model('Order',orderSchema);
