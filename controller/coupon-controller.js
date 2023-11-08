const Coupon=require('../model/coupon_model')
const User=require('../model/user-model')

//View coupon page
const getcoupon=async(req,res)=>{
    try {
        let session=req.session.user_id
        session = session ? true : false;
        const getcoupon=await Coupon.find().lean()
        res.render('admin/coupon',{admin:true,user:false,getcoupon,session})

    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
//vie Add coupon page
const loadaddcoupon=async(req,res)=>{
    try {
        let session=req.session.user_id
        session = session ? true : false;
        res.render('admin/addcoupon',{admin:true,user:false,session})
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
// Add coupon
const addcoupon=async(req,res)=>{
    try {
        const coupon=new Coupon({
            couponName:req.body.couponName,
            couponCode:req.body.couponCode,
            discountValue:req.body.discountValue,
            minPurchase:req.body.minPurchase,
            maxDiscount:req.body.maxDiscount,
            limit:req.body.limit,
            expireDate:req.body.expireDate
        })
        const couponData=await coupon.save()
        if(couponData){
            res.redirect('/admin/coupon')
        }

    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
//deActivecoupon
const deActivecoupon=async(req,res)=>{
    try {
        await Coupon.findByIdAndUpdate({_id:req.query.id},{$set:{status:false}})
        res.redirect('/admin/coupon')
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}

//Activecoupon
const Activecoupon=async(req,res)=>{
    try{
        await Coupon.findByIdAndUpdate({_id:req.query.id},{$set:{status:true}})
        res.redirect('/admin/coupon')
    }catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
//deletecoupon
const deletecoupon=async(req,res)=>{
    try{
        const deletecoupon=req.query.id
        await Coupon.findByIdAndDelete(deletecoupon)
        res.redirect('/admin/coupon')
    }catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
//userviewcoupon
const userviewcoupon=async(req,res)=>{
    try {
        let session=req.session.user_id
        session = session ? true : false;
        const user=req.session.user_id
        const userdata=await User.findById(user)
        const coupon=await Coupon.find()
        res.render('user/usercoupon',{user:true,admin:false,coupon,userdata,session})
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }

}
//applycoupon
const applycoupon=async(req,res)=>{
    try {
        let code=req.body.code
        let amount=req.body.amount
        let userId=req.session.user_id
        let userexist=await Coupon.findOne({
           couponCode:code,
           whoUsed:{$in:[userId]},
        }).lean()
        if(!userexist){
            let couponData=await Coupon.findOne({couponCode:code}).lean()
            if(couponData){
                if(couponData.expireDate>=new Date())
                {
                    if(couponData.limit>0)
                    {
                        if(couponData.minPurchase<=amount){
                            let discountValue1=couponData.discountValue
                            let discountAmount=Math.floor((discountValue1/100)*amount)
                            if(discountAmount>couponData.maxDiscount)
                            {
                                discountAmount=couponData.maxDiscount
                            }
                            let distotal = amount-discountAmount
                            let discount = discountAmount
                            let couponId = couponData._id;
                            req.session.couponId = couponId;
                            req.session.discount = discount
            
                            req.session.coupon = code
                            res.json({
                              couponokey:true,
                              distotal,
                              discount,
                              code,
                            });
                        }else{
                            res.json({ cartamount: true });
                        }
                    }else{
                        res.json({ limit: true });
                    }
                }else{
                    res.json({ expire: true });
                }
            }else{
                res.json({ invalid: true });
            }

        }else{
            res.json({ user: true });
        }

      
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
//remove coupon
const removecoupon=async(req,res)=>{
    try {
        req.session.coupon = null
        req.session.couponId = null
        req.session.discount = null
        res.redirect('/checkout')
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}

//view edit coupon
const loadeditcoupon=async(req,res)=>{
    try {
        let session=req.session.user_id
        session = session ? true : false;
        const coupondata=await Coupon.findOne({_id:req.query.id})
       
        res.render('admin/editcoupon',{admin:false,user:false,coupondata,session})
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
//edit coupon
const editcoupon=async(req,res)=>{
    try {
     
        const coupondata=await Coupon.updateOne({_id:req.body._id},{$set:{
            couponName:req.body.couponName,
            couponCode:req.body.couponCode,
            discountValue:req.body.discountValue,
            minPurchase:req.body.minPurchase,
            maxDiscount:req.body.maxDiscount,
            limit:req.body.limit,
            expireDate:req.body.expireDate   
        }})
        .then((result)=>{
            
        })
      
        res.redirect('/admin/coupon')
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
module.exports={
    getcoupon,
    addcoupon,
    loadaddcoupon,
    deActivecoupon,
    Activecoupon,
    deletecoupon,
    userviewcoupon,
    applycoupon,
    removecoupon,
    loadeditcoupon,
    editcoupon

}