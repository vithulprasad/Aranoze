const User = require('../model/user-model')
const Cart = require('../model/cart-model')
const Product = require('../model/productmodel')
const Order = require('../model/order-model')
const Coupon=require('../model/coupon_model')
const Razorpay=require('razorpay')
var instance = new Razorpay({key_id:"rzp_test_QcMvv53AoEYjKO", key_secret:"CAcorDFI1NoI8zlebaZcU2rJ"})

const uuid = require('uuid');
const { default: mongoose } = require('mongoose');

// load checkout page
const loadcheckout = async (req, res) => {
  try {
    const userId = req.session.user_id;
    let noAddress 
    let session=req.session.user_id
    session = session ? true : false;
    const cartData = await Cart.findOne({ user: userId })
    const userdata = await User.findOne({ _id: userId }).lean()
    if(userdata.address.length==0){
       noAddress =true;
    res.render('user/checkout', { admin: false, user: true, Cart: cartData, user: userdata ,noAddress,session})

    }else{
       noAddress=false
       res.render('user/checkout', { admin: false, user: true, Cart: cartData, user: userdata,noAddress,session})

    }
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
}

//Load Addresspage
const loadadress = async (req, res) => {
  try {
    let session=req.session.user_id
    session = session ? true : false;
    res.render('user/addaddress', { user: false, admin: false,session })
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
}


//Add new Address
const Newadress = async (req, res) => {
  try {
    const userid = req.session.user_id
    let { name, address, pin, country, state, city, mob } = req.body
    const newaddress = {
      name,
      address,
      pin,
      country,
      state,
      city,
      mob

    }
    const findaddress = await User.findByIdAndUpdate({ _id: userid }, { $addToSet: { address: newaddress } })

    if (findaddress) {
      res.redirect('/checkout')
    }
    else {
      res.send('not working')
    }

  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
}
//Delete Address
const deleteaddress = async (req, res) => {
  try {

    const userId = req.session.user_id
    const id = userId._id
    await User.findByIdAndUpdate(userId, {
      $pull: { address: { _id: req.query.id } }
    })
    res.redirect('/checkout')
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
}
//view Edit Address
const loadeditAddress = async (req, res) => {
  try {
    let session=req.session.user_id
    session = session ? true : false;
    const userId = req.session.user_id
    const { address: [Editaddress] } = await User.findOne(
      { _id: userId },
      { address: { $elemMatch: { _id: req.query.id } } }).lean()
    res.render('user/editaddress', { admin: false, user: false, address: Editaddress,session })
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
}
//Add edit address
const Addeditaddress = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const findeditid = await User.findOne({ _id: userId });
    const adrsID = req.body.id;
    const updateaddress = await User.updateOne(
      { _id: userId, 'address._id': adrsID }, // Match the specific address using its unique _id
      {
        $set: {
          'address.$.name': req.body.name,
          'address.$.mob': req.body.mob,
          'address.$.address': req.body.address,
          'address.$.country': req.body.country,
          'address.$.state': req.body.state,
          'address.$.city': req.body.city,
          'address.$.pin': req.body.pin,
        },
      }
    );

    res.redirect('/checkout');
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
};
//select address
const selectaddress = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const seId = req.query.id;
    const updatestatus = await User.updateOne(
      { _id: userId, 'address._id': seId },
      {
        $set: {
          'address.$.status': true,
        },
      }
    );
    const falsestatus = await User.find({ _id: userId }).select('address').lean();
    falsestatus.forEach(async (element) => {
      element.address.forEach(async (innerelement) => {
        if (seId != innerelement._id) {
          await User.updateOne(
            {
              'address._id': innerelement._id,
            },
            {
              $set: { 'address.$.status': false },
            }
          );
        }
      });
    });
    res.redirect('/checkout')
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
};
 //view placeorder
const placeorder = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const totalAmount = req.body.totalamount;
    const userDeatails = await User.findOne({ _id: userId });
    let discount = req.session.discount ? req.session.discount : 0;
    const Uaddress = userDeatails.address.filter(address => address.status);
    const payment = req.body.payment;
    const [{ name, address, pin, country, state, city, mob }] = Uaddress;
    req.session.payment = payment;
    req.session.totalAmount = totalAmount;
    const addressData = {
      name,
      address,
      pin,
      country,
      state,
      city,
      mob
    };
    req.session.address = addressData;
    const collection = await Cart.findOne({ user: userId }).populate('item').lean();

    await collection.item.forEach(async(proId)=>{
      await Product.findOneAndUpdate({_id:proId.product},{ $inc: { stock: -proId.quantity } }, { new: true } )
    })

    if (payment == 'COD') {
      if (req.session.couponId != null) {
        discount = req.session.discount;
      }
    
    const order = new Order({
      user: userId,
      item: collection.item,
      totalAmount: totalAmount,
      discount: discount,
      address: addressData,
      paymentType: req.body.payment,
      date: new Date()
    });
    const saveorder = await order.save();
    if (req.session.coupon) {
      const insertUser = await Coupon.findByIdAndDelete(req.session.couponId, {
        $inc: { limit: -1 },
        $push: { whoUsed: userId }
      });
      req.session.coupon = null;
      req.session.couponId = null;
      req.session.discount = null;
    }
    req.session.userOrder = order._id;

    Promise.all(collection.item.map(({ productId, quantity }) => {
      return Product.findOneAndUpdate({ _id: productId }, { $inc: { quantity: -quantity } });
    }));

    const orderdata = await Order.find({ _id: order._id }).lean("product").lean();
    let username = req.session.user_id.firstName;

    if (saveorder) {
      const deleteCart = await Cart.findOneAndDelete({ user: userId });
      res.json({type:"cod"})
    }
  }else if(payment == "Online"){
    //payment integration
    const { v4: uuidv4 } = require('uuid')
    const receiptId = uuidv4()


   
    const price = parseInt(totalAmount);
    const option = {
        amount: price * 100,
        currency: "INR",
        receipt: receiptId,
    }
   
instance.orders.create(option, function(err, order) {
        
       
                if (err) {
                    res.json({ error: err })
                } else {
                    res.json({ razorpayDetails: order })
                }
    })

}else{
  const wallethistory = userDeatails.walletAmount
  if(wallethistory >= totalAmount){
        
    const order = new Order({
      user: userId,
      item: collection.item,
      totalAmount: totalAmount,
      discount: discount,
      address: addressData,
      paymentType:"wallet",
      date: new Date()
    });
    const saveorder = await order.save();
    if (req.session.coupon) {
      const insertUser = await Coupon.findByIdAndDelete(req.session.couponId, {
        $inc: { limit: -1 },
        $push: { whoUsed: userId }
      });
      req.session.coupon = null;
      req.session.couponId = null;
      req.session.discount = null;
    }
    req.session.userOrder = order._id;

    Promise.all(collection.item.map(({ productId, quantity }) => {
      return Product.findOneAndUpdate({ _id: productId }, { $inc: { quantity: -quantity } });
    }));

    const orderdata = await Order.find({ _id: order._id }).lean("product").lean();
    let username = req.session.user_id.firstName;

    if (saveorder) {
      const newAmount = userDeatails.walletAmount - collection.totprice;
      await User.updateOne({_id:req.session.user_id},{$set:{walletAmount:newAmount}})
      const deleteCart = await Cart.findOneAndDelete({ user: userId });
      res.json({type:"wal"})
    }

  }else{
    res.json({
      type:"walError"
    })
  }
 
}
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
};

//load success page
const loadsucesspage=async(req,res)=>{
  try {
    let session=req.session.user_id
    session = session ? true : false;
    res.render('user/paymentSucess',{admin:false,user:false,session})
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
}
//view my orders
const myorder=async(req,res)=>{
  try {
    if(req.session.user_id){
      let session=req.session.user_id
      session = session ? true : false;
     const datas= await Order.find().sort({date:-1})
      const orderdata= datas.filter((value)=>{
        return value.user == req.session.user_id;
      })
      res.render('user/myorder',{admin:false,user:true,orderdata,session})
    }else{
      res.redirect("/user/login")
    }
   
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
}

//view deatails
const ViewDetails=async(req,res)=>{
  try {
    let session=req.session.user_id
    session = session ? true : false;
    const user=req.session.user_id
    const orderId=req.query.id
    const userdata=await User.findOne({_id:user}).lean()
    const orderdata=await Order.findById(orderId).populate('item.product')
   
    const orderdate = new Date(orderdata.deliveredDate);
    const today = new Date();
    const orderDateWithoutTime = new Date(orderdate.toDateString());
    const todayWithoutTime = new Date(today.toDateString());
    
    const daysDifference = Math.ceil((todayWithoutTime - orderDateWithoutTime) / (1000 * 60 * 60 * 24));
    let delivered=false;
    if(orderdata.orderStatus=="Delivered"){
      delivered = true
    }
    res.render('user/orderView',{admin:false,user:false,orderdata,userdata,daysDifference,delivered,session})

  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
}

//cancelorder
const cancelOrder = async(req,res)=>{
  try {
    
    const orderId = req.body.orderId 
    const user = await User.findOne({_id:req.session.user_id})
  
    const currentAmount = user.walletAmount;
    const find = await Order.findOne({_id:orderId,})
  
    await find.item.forEach(async(proId)=>{
      await Product.findOneAndUpdate({_id:proId.product},{ $inc: { stock: +proId.quantity } }, { new: true } )
    })

    await Order.updateOne({_id:orderId},{$set:{orderStatus:"Canceled"}})
    
    const sum = currentAmount+find.totalAmount
    if(find.paymentType=="online"||find.paymentType=="wallet"){
      const history = {
        tdate:find.date,
        amount:find.totalAmount,
        sign:find.paymentType
      }
      await User.updateOne(
        { _id: req.session.user_id },
        { $push: { wallethistory: history } }
      );
      const result = await User.updateOne(
        { _id: req.session.user_id },
        { $set: { walletAmount: sum} }
      );
    }
    res.json({success:true})
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
}

//Return Request
const returnRqst = async(req,res)=>{
  try {
    
    const orderId =req.body.orderId  
    await Order.updateOne({_id:orderId},{$set:{orderStatus:"Return processing"}})
    res.json({success:true})
    }
  catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
}


//view Admin Order
const loadadminorder=async(req,res)=>{
  try {
    let session=req.session.user_id
    session = session ? true : false;
    const orders=await Order.find().sort({date:-1})
    res.render('admin/orders',{admin:true,user:false,orders,session})
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
}

//admin View order Deatails
const loadadminViewdetails=async(req,res)=>{
  try{
    let session=req.session.user_id
    session = session ? true : false;
    const orderID=req.query.id
    const orderdata=await Order.findById(orderID).populate('item.product')
    const userdata=await User.findById(orderdata.user)
    res.render('admin/orderView',{admin:true,user:false,orderdata,userdata,session})
  }catch(error)
  {
    res.render('user/404error',{admin:false,user:false})
  }
}

//deliver order
const deliverOrder = async(req,res)=>{
    try {
      const orderId = req.body.orderId  
      const deliverdate=new Date()
      await Order.updateOne({_id:orderId},{$set:{orderStatus:"Delivered",deliveredDate:deliverdate}})
      res.json({success:true})
    } catch (error) {
      res.render('user/404error',{admin:false,user:false}) 
    }
  }

//shipped order
 const shippedOrder = async(req,res)=>{
    try {
      const orderId = req.body.orderId   
      await Order.updateOne({_id:orderId},{$set:{orderStatus:"Shipped"}})
      res.json({success:true})
    } catch (error) {
      res.render('user/404error',{admin:false,user:false})
    }
  }

//confirm requist
  const confirmReturned = async(req,res)=>{
    try {
      const orderId = req.body.orderId      
      await Order.updateOne({_id:orderId},{$set:{orderStatus:"Returned"}})
      res.json({success:true})
    } catch (error) {
      res.render('user/404error',{admin:false,user:false})
    }
  }
  //payment sucess
  const success = async (req, res) => {
    try {
        if (req.session.user_id) {
            const paymentDetails = req.body
            const crypto = require('crypto');
            const hmac = crypto.createHmac('sha256', 'CAcorDFI1NoI8zlebaZcU2rJ')
              .update(req.body.payment.razorpay_order_id + '|' + req.body.payment.razorpay_payment_id)
              .digest('hex')
            if (hmac == req.body.payment.razorpay_signature) {
                const userId = req.session.user_id
                const userCart = await Cart.findOne({ user: userId })
                const discount =  req.session.discount?req.session.discount:0
                const collection = await Cart.findOne({ user: userId }).populate('item').lean();
                const order = new Order({
                  user: userId,
                  item: collection.item,
                  totalAmount:req.body.totalAmount,
                  discount: discount,
                  address: req.session.address,
                  paymentType:"online",
                  date: new Date()
                });
                const saveorder = await order.save();

                Promise.all(userCart.item.map(({productId,quantity}) => {
                    return Product.findOneAndUpdate({_id:productId},{$inc:{quantity:-quantity}})
                  }))
                  
                if(req.session.coupon){
                    const insertUser = await Coupon.findByIdAndUpdate(req.session.couponId,
                        {
                        $inc:{limit:-1},
                        $push:{whoUsed:userId}
                        })
                        req.session.coupon = null
                        req.session.couponId = null
                        req.session.discount = null
                }
                req.session.userOrder = order._id
                username = req.session.user_id.firstName

                if (saveorder) {
                  const removeCart = await Cart.deleteOne({ user: userId })
                  res.json({success:true})
                }
            } else {
                
            }
        } else {
            redirect('/')
        }
    } catch (error) {
      res.render('user/404error',{admin:false,user:false})
    }
}
//Rating And review
const ratingAndreview=async(req,res)=>{
  try {
    let session=req.session.user_id
    session = session ? true : false;
    const orderId=req.query.id
 
    res.render('user/review',{admin:false,user:true,id:orderId,session})
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
}
const ratingReview = async(req,res)=>{
try {
 
  const user=req.session.user_id
   const id=req.body
  const productdata = await Product.findByIdAndUpdate(
    { _id:req.body.orderId },
    {
      $push: {
        review: {
          rating: req.body.count, // Assuming 'count' is the variable containing the rating value
          review:req.body.message, // Assuming 'message' is the variable containing the review message
          user: user, // Assuming 'req.user._id' contains the ID of the user providing the review
        },
      },
    },
    { new: true } 
    // This option returns the updated document after the update is applied
  );
  
  if(productdata){
    res.send({message:"/",success:true})
  }
   
   }
  
  
catch (error) {
  res.render('user/404error',{admin:false,user:false})
} 
}



module.exports = {
  loadcheckout,
  loadadress,
  Newadress,
  deleteaddress,
  loadeditAddress,
  Addeditaddress,
  selectaddress,
  placeorder,
  loadsucesspage,
  myorder,
  ViewDetails,
  loadadminorder,
  loadadminViewdetails,
  cancelOrder,
  returnRqst,
  deliverOrder,
  shippedOrder,
  confirmReturned,
  success,
  ratingAndreview,
  ratingReview
} 

