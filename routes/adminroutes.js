const express=require('express')
const admin_route=express()
const nocache=require('nocache')
const adminController=require('../controller/admin-controller')
const catagoryControler=require('../controller/catagory-controller')
const productcontroller=require('../controller/product-controller')
const ordercontroller=require('../controller/order-controller')
const couponController=require('../controller/coupon-controller')
const bannerController=require('../controller/banner-controller')
const excelcontroller=require('../controller/execl-controller')
const session=require('express-session')
const config=require('../config/config')
admin_route.use(session({secret:config.sessionSecret}))
const auth=require('../middleware/auth')
const upload=require('../middleware/multer')

//admin login
admin_route.get('/signin',adminController.alogin)
admin_route.post('/signin',nocache(),auth.adminlogOut,adminController.loginVerify)
admin_route.get('/adminLogout',adminController.AdminLogout)

//admin side in users
admin_route.get('/userlist',auth.adminLogin,adminController.userlist)
admin_route.get('/block/:id',adminController.block)
admin_route.get('/unblock/:id',adminController.unblock)

//category routes
admin_route.get('/catagory',auth.adminLogin,catagoryControler.loadcatagory)
admin_route.post('/addcatagory',catagoryControler.insertCatagory)
admin_route.get('/unlistcatagory/:id',auth.adminLogin,catagoryControler.listcatagory)
admin_route.get('/listcatagory/:id',auth.adminLogin,catagoryControler.unlistcatagory)
admin_route.get('/deletecatagory/:id',catagoryControler.deleteCatagory)

//product routes
admin_route.get('/product',auth.adminLogin,productcontroller.loadproduct)
admin_route.get('/addproduct',auth.adminLogin,productcontroller.loadAddproducts)
admin_route.post('/addproduct',auth.adminLogin,upload.upload,productcontroller.addproducts)
admin_route.get('/listproduct/:id',auth.adminLogin,productcontroller.listproduct)
admin_route.get('/unlistproduct/:id',auth.adminLogin,productcontroller.unlistproduct)
admin_route.get('/deleteproduct/:id',auth.adminLogin,productcontroller.deleteproduct)
admin_route.get('/updateproduct',auth.adminLogin,productcontroller.loadupdateproduct)
admin_route.post('/editProduct',auth.adminLogin,upload.upload,productcontroller.updateproduct)
admin_route.get('/removeImg',productcontroller.removeProductImg)

//order route in admin side
admin_route.get('/orders',auth.adminLogin,ordercontroller.loadadminorder)
admin_route.get('/ordersDetail',ordercontroller.loadadminViewdetails)
admin_route.post('/deliverOrder',ordercontroller.deliverOrder)
admin_route.post('/shippedOrder',ordercontroller.shippedOrder)
admin_route.post('/confirmReturned',ordercontroller.confirmReturned)

//coupon management
admin_route.get('/coupon',auth.adminLogin,couponController.getcoupon)
admin_route.get('/addcoupon',couponController.loadaddcoupon)
admin_route.post('/addcoupon',couponController.addcoupon)
admin_route.get('/activate',couponController.Activecoupon)
admin_route.get('/editcoupon',couponController.loadeditcoupon)
admin_route.post('/editcoupon',couponController.editcoupon)
admin_route.get('/deactivate',couponController.deActivecoupon)
admin_route.get('/deletecoupon',couponController.deletecoupon)

//banner Mangement
admin_route.get('/banner',auth.adminLogin,bannerController.loadbanner)
admin_route.get('/addbanner',auth.adminLogin,bannerController.loadaddbaner)
admin_route.post('/addbanner',upload.upload2,bannerController.addbanner)
admin_route.get('/deletebanner',bannerController.deleteBanner)
admin_route.get('/editbanner',bannerController.loadEditbanner)
admin_route.get('/activebanner',bannerController.ActiveBanner)
admin_route.get('/deactivebanner',bannerController.DeactiveBanner)
admin_route.post('/editbanner',upload.upload2,bannerController.Editbanner)
admin_route.get('/removeimage', bannerController.deleteBannerImg);

//seles report
admin_route.get('/sales',auth.adminLogin,adminController.salesreport)
admin_route.get('/downloadexcel',excelcontroller.downloadExcel)
admin_route.get('/home',adminController.loadHome)






module.exports=admin_route;
