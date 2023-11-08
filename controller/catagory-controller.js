const Category = require('../model/catagory-model')

//View Category
const loadcatagory = async (req, res) => {
  try {
    let session=req.session.user_id
    session = session ? true : false;
    const catdetalis = await Category.find().lean();
    res.render('admin/catagory', { category: catdetalis, admin: true, user: false, added: false, exist: false,session })

  }
  catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
}

//insert Category
const insertCatagory = async (req, res) => {
  try {
    let session=req.session.user_id
    session = session ? true : false;
    const extcat = await Category.findOne({ name: req.body.name })
    if (extcat) {
      const category = await Category.find().lean()
      res.render('admin/catagory', { category, exist: true, admin: true, user: false, added: false,session });
    }
    else {
      const catagorys = new Category({
        name: req.body.name
      });
      await catagorys.save()
      const category = await Category.find().lean()
      res.render('admin/catagory', { category, added: true, admin: true, user: false, exist: false,session })
    }
  }
  catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
}
//list Category
const listcatagory = async (req, res) => {
  try {
    const catagoryData = await Category.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { status: false } }
    );
    res.redirect('/admin/catagory')
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
}
//unlist Category
const unlistcatagory = async (req, res) => {
  try {
    const catagoryData = await Category.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { status: true } }
    );
    res.redirect('/admin/catagory')
  }
  catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
}
//deleteCategory
const deleteCatagory = async (req, res) => {
  try {
    const id = req.params.id;
    await Category.findByIdAndDelete(id);
    res.redirect('/admin/catagory');
  } catch (error) {
    res.render('user/404error',{admin:false,user:false})
  }
};


module.exports = {
  loadcatagory,
  insertCatagory,
  listcatagory,
  unlistcatagory,
  deleteCatagory
}