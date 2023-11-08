const mongoose=require('mongoose')
const cartSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    item:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true
        },
        quantity:{
            type:Number,
            default:0
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
    totprice:{
        type:Number,
        default:0
    }

});
module.exports=mongoose.model('Cart',cartSchema)
