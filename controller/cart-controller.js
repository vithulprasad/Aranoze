

const User = require('../model/user-model.js')
const Product = require('../model/productmodel.js')
const Cart = require('../model/cart-model.js');
const { default: mongoose } = require('mongoose');

//get Cart
const getCart = async (req, res) => {
  try {
    let session=req.session.user_id
    session = session ? true : false;
    const usersession = req.session.user_id;
    if (usersession) {
      const accessUserData = await Cart.find({ user: new mongoose.Types.ObjectId(usersession) }).populate("item.product")
     
      const data =await Cart.findOne({user :new mongoose.Types.ObjectId(usersession)});
     
      const count = data && data?.item ? data.item.length : 0
      res.render('user/cart', { admin: false, user: true, accessuserdata: accessUserData, usersession,count,session});

    } else {
      res.redirect('/login'); 
    }
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
};


//product add to cart
const addtocart = async (req, res) => {
  try {
    const user = req.session.user_id;
    if (user) {
      const productid = req.query.id;
      const product = await Product.findOne({ _id: productid });
      if(product.stock<=0){
        return res.json({status:false,message:"Out of stock!"})
      }
      const cart = await Cart.findOne({ user: user });
      if (!cart) {
        const addcart = new Cart({
          user: req.session.user_id,
          item: [
            {
              product: productid,
              price:product.price,
              totalprice: product.price,
              quantity: 1
            }
          ], totprice: product.price
        });
        await addcart.save();
      } else {
        const findItems = cart.item.find((value) => {
          return value.product == productid;
        });
        if (findItems) {
        
          res.json({ status: false, message: '............' });
        } else {
          const products = {
            product: productid,
            price:product.price,
            totalprice: product.price,
            quantity: 1
          };
          await Cart.findOneAndUpdate(
            { user: req.session.user_id },
            { $push: { item: products }, $inc: { totprice: product.price } },
          );
          res.json({ status: true });
        }
      }
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
};
//Delete Cart

const deleteFromCart = async (req, res) => {
  try {
    const userId = req.session.user_id; 
    const proId = req.params.id;

    if (userId) {
      const detail=await Cart.findOne({user:userId}).populate('item.product').lean()
      const details=detail.item.find((value)=>value.product._id==proId);
      const total = detail.totprice - details.totalprice;
      const updateprodut=await Cart.findOneAndUpdate(
        {user:userId},
        {$set:{"totprice":total}},
        {new:true}
      )
     const deleteproduct=await Cart.findOneAndUpdate(
      {user:userId},
      {$pull:{item:{product:proId}}},{new:true})

      if(deleteproduct){
        res.json({ success: true });
      }else{
        res.redirect('/user/login');
      }      
    } else {
      res.redirect('/user/login');
    }
  } catch (error) {
    
    res.render('user/404error',{admin:false,user:false})
  }
};

//Change Quantity
const changequantity = async (req, res) => {
  try {
    let totalprice
    let productTotal
    const details = req.body
    const product = await Product.findOne({ _id: details.product })
    details.count = parseInt(details.count)
    details.quantity = parseInt(details.quantity)
    if (details.count == -1 && details.quantity ==1) {

      const cartData = await Cart.findByIdAndUpdate({ _id: details.cart }, { $pull: { item: { product: details.product } }, $inc: { 'item.$.totalprice': product.price * details.count } })
      totalprice = cartData.totprice
      productTotal = product.price
      if (cartData) {
        res.json({ removeProduct: true, totalprice, productTotal })
      }
    
    }  else    {
      
      if(product.stock>details.quantity || details.count==-1 && product.stock > 0){
          const cartData = await Cart.updateOne({ _id: details.cart, 'item.product': details.product }, { $inc: { 'item.$.quantity': details.count, 'item.$.price': product.price * details.count, 'item.$.totalprice': product.price * details.count, "totprice": product.price * details.count } })
          const cartDetails = await Cart.findOne({ _id: details.cart })
          const itemIndx = cartDetails.item.findIndex((p) => p.product == details.product)
          const q = cartDetails.item[itemIndx].quantity
          totalprice = cartDetails.totprice
          productTotal = product.price
          res.json({ status: true, totalprice, productTotal, q })
      }else{
      }
      

    }

  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
}

module.exports = {
  getCart,
  addtocart,
  deleteFromCart,
  changequantity

}
