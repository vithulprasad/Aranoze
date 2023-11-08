const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    category: {
        type:String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        required:true
    },
    review:
        [{
           rating:{
            type:Number
           },
           review:{
            type:String
           },
           user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        
        }
        }

        ],
        
    
});

module.exports = mongoose.model("Product", productSchema);
