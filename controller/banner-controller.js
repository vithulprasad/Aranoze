const Banner=require('../model/banner-model')

//banner View
const loadbanner=async(req,res)=>{
    try {
        let session=req.session.user_id
        session = session ? true : false;
        const Bannerdata=await Banner.find()
        res.render('admin/banner',{admin:true,user:false,Bannerdata,session})
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
//view add banner
const loadaddbaner=async(req,res)=>{
    try {
        let session=req.session.user_id
        session = session ? true : false;
        res.render('admin/addbanner',{admin:true,user:false,session})
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
//add banner
const addbanner=async(req,res)=>{
    try {
        
       console.log(req.body);
       const img = req.file.filename
        const addbanner=new Banner({
            bannername:req.body.bannerName,
            tittle:req.body.bannerTittle,
            description:req.body.discription,
            image:img,
            url: req.body.btnurl
        
        })
        const bannerdata=await addbanner.save() 
        res.redirect('/admin/banner')

       

    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
//delete banner
const deleteBanner=async(req,res)=>{
    try{
    const bannerid=req.query.id
    await Banner.deleteOne({_id:bannerid})
    res.redirect('/admin/banner')
    }
    catch(error){
        res.render('user/404error',{admin:false,user:false})
    }
}
//Active banner
const ActiveBanner=async(req,res)=>{
    try {
         const banner = await Banner.findByIdAndUpdate({_id:req.query.id},{$set:{status:false}})
         console.log(banner)
        res.redirect('/admin/banner')
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
//Deactive Banner
const DeactiveBanner=async(req,res)=>{
   try {
    await Banner.findByIdAndUpdate({_id:req.query.id},{$set:{status:true}})
    res.redirect('/admin/banner')
   } catch (error) {
    res.render('user/404error',{admin:false,user:false})
   }
}
//View EditBanner
const loadEditbanner=async(req,res)=>{
    try {
        let session=req.session.user_id
        session = session ? true : false;
        const bannerid=req.query.id
        const bannerdata=await Banner.findOne({_id:bannerid})
        res.render('admin/editbanner',{admin:false,user:false,bannerdata,session})
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
//Edit Banner
const Editbanner=async(req,res)=>{
    try {
        const existingImg = await Banner.findById(req.body._id)
        let img
        if(existingImg.image){
            img = existingImg.image
        }else{
            img=req.file.filename  
        }
      const editbanner=await Banner.findByIdAndUpdate({_id:req.body._id},{$set:{
            bannername:req.body.bannerName,
            tittle:req.body.bannerTittle,
            description:req.body.discription,
            image:img,
            url: req.body.btnurl

        }})
        res.redirect('/admin/banner')
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
//delete banner img
const deleteBannerImg = async (req, res) => {
    try {
        const id = req.query.id;
        const image = req.query.image; // Corrected query parameter name to 'image'
        const deleteImg = await Banner.updateOne({ _id: id }, {
            $set: { image: '' }
        });
        res.redirect(`/admin/editbanner/?id=${id}`);
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
};

module.exports={
    loadbanner,
    loadaddbaner,
    addbanner,
    deleteBanner,
    ActiveBanner,
    DeactiveBanner,
    loadEditbanner,
    Editbanner,
    deleteBannerImg


}