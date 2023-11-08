const Product=require('../model/productmodel')
const Category=require('../model/catagory-model')

//viw diffrent category page
const loadcategorypage=async(req,res)=>{
    try {
        let session=req.session.user_id
        session = session ? true : false;
       let result=await Product.find().limit(6)
       let catagory=await Category.find()
        res.render('user/categerypage',{user:true,admin:false,result,catagory,session})
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
// the next button
const nextbutton=async(req,res)=>{
    try {
        let cou = parseInt(req.body.count);
        if(req.body.type=="increment"){
           
          cou++;
        }else{
           
          cou--;
        }
        const productdata = await Product.find();
        let currentPage =6*cou
        const pipeline = [
            { $skip:currentPage  },
            { $limit: 6 } // Move the limit(4) here, after the $skip stage
        ];
        
        const result = await Product.aggregate(pipeline);
        
        

     res.json({page:cou,result})
       
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
const search=async(req,res)=>{
    try {
        let value=req.body.data;
        const searchValue =value;
        const query = {
          name: { $regex: new RegExp(searchValue, 'i') }
        };
        
        const result = await Product.find(query);
        res.json({result})
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
// The Category filtering
const categeyfilter = async (req, res) => {
    try {
        const category = req.body.category;
        
        const result = await Product.aggregate([
            {
                $match: {
                    category: category
                }
            }
        ]);
        
        res.json({result});
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}


module.exports={
    loadcategorypage,
    nextbutton,
    search,
    categeyfilter
}