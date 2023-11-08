const Admin = require('../model/admin-model')
const User = require('../model/user-model')
const bcrypt = require('bcrypt')
const Order=require('../model/order-model')


// admin login
const alogin = async (req, res) => {
    try {
        res.render('admin/signin', { admin: false, user: false })
    }
    catch (error) {
      
    }
}

//admin Login verify
const loginVerify = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
       
        if (email == process.env.admin && password == process.env.password) {
            req.session.isAdmin = email;
            req.session.isAdmin = true;
            res.redirect('/admin/home')
        } else {
            res.render('admin/signin', { message: 'email and password are incorrect', admin: false, user: false })
        }

    } catch (error) {
      res.render('user/404error',{admin:false,user:false})
    }
}

const AdminLogout = async (req, res) => {
  try {
    req.session.isAdmin=null;
      res.redirect('/admin/signin');
  } catch (error) {
   
  }
}
//admin Home
const loadHome = async (req, res) => {
    try {
        const countCod = { paymentType: "COD" };

        const cCod = await Order.countDocuments(countCod);
      
        
        const countOnline = { paymentType: "online" };
        const cOnline = await Order.countDocuments(countOnline);
        
        
        const countWallet = { paymentType: "wallet" };
        const cWallet = await Order.countDocuments(countWallet);
        
        
        const countDelivered = { orderStatus: "Delivered" };
        const cDelivered = await Order.countDocuments(countDelivered);
        
        
        const countOrdered = { orderStatus: "ordered" };
        const cOrdered = await Order.countDocuments(countOrdered);
        
        
        const countReturned = { orderStatus: "Returned" };
        const cReturned = await Order.countDocuments(countReturned);
       
        
        const countShipped = { orderStatus: "Shipped" };
        const cShipped = await Order.countDocuments(countShipped);
       
        const countCancelled = { orderStatus: "Canceled" };
        const cCancelled = await Order.countDocuments(countCancelled);
        
  
      const countUser = await User.count({access:true})
    
     
     
      const countBlockedUser = await User.countDocuments({access:false})
     
     
      const sumOfDelivered =  await Order.aggregate([
        {
          $match: {
            orderStatus: "Delivered"
          }
        },
        {
          $group: {
            _id: null,
            totalAmount: {
              $sum: "$totalAmount"
            }
          }
        }
      ])
      const totalAmount = sumOfDelivered[0].totalAmount;
    
      const totalWallet =  await User.aggregate([
        {
          $group: {
            _id: null,
            walletAmount: {
              $sum: "$walletAmount"
            }
          }
        }
      ])
   
      const walletTotal = totalWallet[0].walletAmount;
      
        res.render('admin/home', { admin: true, user: false ,dash: true,
                   cWallet,
                    cOnline,
                    cCod,
                    cOrdered,
                    cReturned,
                    cDelivered,
                    cCancelled,
                    cShipped,
                    countUser,
                    countBlockedUser,
                    totalAmount,
                    walletTotal
                   
                })
    } catch (error) {
      res.render('user/404error',{admin:false,user:false})
    }
}

//user List

const userlist = async (req, res) => {

    try {
        const userdata = await User.find().sort({ _id: 1 })
        res.render('admin/userlist', { users: userdata, user: false, admin: true })
    }
    catch (error) {
      res.render('user/404error',{admin:false,user:false})
    }
}
//block user
const block = async (req, res) => {
    try {
      const id=req.params.id;
      await User.updateOne({_id:id},{$set:{access:false}});
      req.session.user_id=null
      res.redirect("/admin/userlist")
    }
    catch (error) {
      res.render('user/404error',{admin:false,user:false})
    }
}
//unblock user
const unblock=async(req,res)=>{
    try{
        const id=req.params.id;
        await User.updateOne({_id:id},{$set:{access:true}})
        res.redirect("/admin/userlist")
    }
    catch(error){
      res.render('user/404error',{admin:false,user:false})
    }
}

//salesreport
const salesreport = async (req, res) => {
  try {
    const from = req.query.from;
    const to = req.query.to;

    let query = { orderStatus: "Delivered" };

    if (from && to) {
      let toDate = new Date(to);
      toDate.setHours(24);
      query.date = {
        $gte: new Date(from),
        $lte: toDate,
      };
    } else if (from) {
      query.date = {
        $gte: from,
      };
    } else if (to) {
      query.date = {
        $lte: to,
      };
    }

    const deliveredPro = await Order.find(query).populate('user').lean();
    const aggregate = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);
       const countOrdered = { orderStatus: "ordered" };
        const cOrdered = await Order.countDocuments(countOrdered);
        const countReturned = { orderStatus: "Returned" };
        const cReturned = await Order.countDocuments(countReturned);
        const countCancelled = { orderStatus: "Canceled" };
        const cCancelled = await Order.countDocuments(countCancelled);
        
    const totalAmount = aggregate[0].totalAmount;
    
    const deliveredProducts = deliveredPro.map((order) => {
      const orderDate = new Date(order.date);
      const formatttedDate = orderDate.toLocaleString();
      const orderId = order._id;
      const finalAmount = order.totalAmount;
      const paymentType = order.paymentType;
      const firstName = order.user ? order.user.firstName : "";
      
      return {
        date: formatttedDate,
        _id: orderId,
        finalAmount,
        paymentType,
        firstName: firstName,
        totalAmount: totalAmount,
        cCancelled,
        cReturned,
        cOrdered
      };
    });

    res.render('admin/sales', { admin: true, user: false, deliveredProducts, from, to, totalAmount,cOrdered,cReturned,cCancelled });
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
};


module.exports = {
    alogin,
    loginVerify,
    userlist,
    block,
    unblock,
    salesreport,
    loadHome,
    AdminLogout 
}