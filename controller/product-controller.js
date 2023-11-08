const product=require('../model/productmodel')
const Category=require('../model/catagory-model')

//vie product page
const loadproduct = async (req, res) => {
  try {
    let session=req.session.user_id
    session = session ? true : false;
    const productdata = await product.find().lean()
    res.render('admin/product', { admin: true, user: false, product:productdata,session });
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
}
//vie add product
const loadAddproducts=async(req,res)=>{
    try{
      let session=req.session.user_id
      session = session ? true : false;
        const catagorydata=await Category.find().lean()
        res.render('admin/addproduct',{admin:false,user:false,addproduct:catagorydata,session})    
        }
        catch(error){
          res.render('user/404error',{admin:false,user:false})
        }
    }
//Add product
const addproducts=async(req,res)=>{
      try{
        let imagearray=[]
        for(let i=0;i<req.files.length;i++){
            imagearray[i]=req.files[i].filename;
        }
        const productdetails=new product({
          name:req.body.name,
          price:req.body.price,
          stock:req.body.stock,
          image:imagearray,
          category:req.body.catagory,
          description:req.body.description,
          status: true
        });
       
       const productdata=await productdetails.save()
       
        if(productdata)
        {
          res.redirect('/admin/product')
        }
        else{
          res.redirect('/admin/product')
        }

      }
      catch(error){
        res.render('user/404error',{admin:false,user:false})
      }
}

//list product
const listproduct=async(req,res)=>{
  try{
   await product.findByIdAndUpdate(  
    {_id:req.params.id},
    {$set:{status:false}}
   )
   res.redirect('/admin/product')
  }
  catch(error){
    res.render('user/404error',{admin:false,user:false})
  }
}
///unlist product
const unlistproduct=async(req,res)=>{
  try{
   await product.findByIdAndUpdate(
    {_id:req.params.id},
    {$set:{status:true}}
   );
   res.redirect('/admin/product')
  }
  catch(error)
  {
    res.render('user/404error',{admin:false,user:false})
  }
}

//delete product
const deleteproduct=async(req,res)=>{
  try{
    const id=req.params.id  
    await product.deleteOne({_id:id})
    res.redirect('/admin/product')
  }
  catch(error){
    res.render('user/404error',{admin:false,user:false})
  }
}
//vie update product
const loadupdateproduct=async(req,res)=>{
  try{
    let session=req.session.user_id
    session = session ? true : false;
   const catagorydata=await Category.find()
   const id=req.query.id
   const productdata=await product.findOne({_id:id}).lean()
   res.render('admin/editproduct',{admin:false,user:false,catagorydata,productdata,session})
  }
  catch(error)
  {
    res.render('user/404error',{admin:false,user:false})
  }
}
//remove image frm product page
const removeProductImg = async (req, res) => {
  try {
    const id = req.query.proid;
    await product.updateOne(
      { _id: id },
      { $pull: { image: req.query.imageId } }
    );
    res.redirect(`/admin/updateproduct/?id=${id}`);
   
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
};
//update product
const updateproduct=async(req,res)=>{
  try{
    if (req.files) {
      const existingProduct = await  product.findOne({_id:req.body.id}).lean()
      let images = existingProduct.image;
      req.files.forEach((file) => {
        images.push(file.filename);
      });

      var img = images;
    }
   
    const updteproduct=await product.updateOne({_id:req.body.id},{$set:{
        name:req.body.name,
        price:req.body.price,
        stock:req.body.stock,
        image:img,
        category:req.body.category,
        description:req.body.description

    }});
    res.redirect('/admin/product');
  }catch(error){
    res.render('user/404error',{admin:false,user:false})
  }
}

module.exports={
  loadproduct,
  loadAddproducts,
  addproducts,
  listproduct,
  unlistproduct,
  deleteproduct,
  loadupdateproduct,
  updateproduct,
  removeProductImg
}






