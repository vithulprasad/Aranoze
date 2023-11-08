const express=require('express')
const user_router=express()
const nocache=require('nocache')
const userController=require('../controller/user-controller')
const cartController=require('../controller/cart-controller')
const orderController=require('../controller/order-controller')
const couponController=require('../controller/coupon-controller')
const bannerController=require('../controller/banner-controller')
const paginationController=require('../controller/pagination-controller')
const wishlistController=require('../controller/wishlist_controller')
const session=require('express-session')
const config=require('../config/config')
const auth=require('../middleware/auth')
user_router.use(session({secret:config.sessionSecret}))

//user sign in and login
user_router.get('/signup',userController.loadRegister)
user_router.post('/signup',userController.signupSubmit)
user_router.get('/login',nocache(),auth.islogOut,userController.loginLoad)
user_router.post('/login',userController.loginVerify)

//otp routes
user_router.get("/otp",userController.loadOtp)
user_router.post("/checkotp",userController.verifyOtp)
user_router.get('/resendotp',userController.reSendOpt)

//user home route
user_router.get('/home',auth.isLogin, userController.homePage);
user_router.get('/', userController.homePage);

//single product
user_router.get('/singleProduct',userController.singleProduct)

//Add to cart routes
user_router.get('/cart',auth.isLogin,cartController.getCart)
user_router.get('/addtocart',auth.isLogin,cartController.addtocart)
user_router.post('/delete-from-cart/:id', auth.isLogin, cartController.deleteFromCart);
user_router.post('/change-product-quantity',cartController.changequantity)

//checkoute routes
user_router.get('/checkout',auth.isLogin,orderController.loadcheckout)
user_router.get('/addaddress',auth.isLogin,orderController.loadadress)
user_router.post('/addaddress',auth.isLogin,orderController.Newadress)
user_router.get('/editaddress',orderController.loadeditAddress)
user_router.post('/editaddress',orderController.Addeditaddress)
user_router.get('/deleteaddress',orderController.deleteaddress)
user_router.get('/selectaddress',orderController.selectaddress)
user_router.get('/paymentSucess',orderController.loadsucesspage)
user_router.post('/placeorder',orderController.placeorder)

//user profile
user_router.get('/userProfile',auth.isLogin,userController.loadUserProfile)
//order View
user_router.get('/myorder',auth.isLogin,orderController.myorder)
user_router.get('/orderDetails',auth.isLogin,orderController.ViewDetails)
user_router.post('/cancelOrder',orderController.cancelOrder)
user_router.post('/returnRqst',orderController.returnRqst)

//user coupon
user_router.get('/usercoupon',auth.isLogin,couponController.userviewcoupon)
user_router.post('/applycoupon',couponController.applycoupon)
user_router.get('/removecoupon',couponController.removecoupon)
//user log out
user_router.get('/userLogout',userController.userLogout)
//order suess page
user_router.post('/success',auth.isLogin,orderController.success)
//wishlist page
user_router.get('/wishlist',auth.isLogin,wishlistController.loadwishlist)
user_router.get('/wishadd',wishlistController.addwishlist)
user_router.get('/deletewishlist',wishlistController.deletewishlist)

//category filtering and pagination
user_router.get('/pagination',paginationController.loadcategorypage)
user_router.post('/changepagination',paginationController.nextbutton)
user_router.post('/search',paginationController.search)
user_router.post('/categoryfilter',paginationController.categeyfilter)
user_router.get('/rating',orderController.ratingAndreview)
user_router.post('/product-review',orderController.ratingReview)



module.exports=user_router;