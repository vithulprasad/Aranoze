const mongoose=require('mongoose')
const wishlistschema=new mongoose.Schema({
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
},
product:[{
    productId:{
    type:String,
    ref:'Product'
    }
}],
})
module.exports=mongoose.model("Wishlist",wishlistschema)