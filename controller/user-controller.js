const User = require('../model/user-model')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer")
const { otpGen } = require("./otpgenerator")
const Product=require('../model/productmodel')
const { listproduct } = require('./product-controller')
const { status } = require('init')
const Banner=require('../model/banner-model')


//Send Mail smtp

const sMail = ((email, otp) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: "eldhoseer440@gmail.com",
            pass: "xjzpgnezqeaxdxmh"
        }
    });

    const mailOptions = {
        from: "eldhoseer440@gmail.com",
        to: email,
        subject: 'Your OTP',
        text: `Your OTP is ${otp}`
    };

    // send the email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            res.render('user/404error',{admin:false,user:false})
        }
    })
})

//view register
const loadRegister = async (req, res) => {
    try {
        res.render('user/signup',{user:false,admin:false,err:false})
    }
    catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
//secure password
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
//view otp page
const loadOtp = async (req, res) => {
    try {
        res.render('user/otp',{user:false,admin:false})

    } catch (error) {
        
        res.render('user/404error',{admin:false,user:false})
    }

}

let userDetails
let otp

const signupSubmit = (req, res) => {
    otp = otpGen()
    userDetails = req.body
    sMail(req.body.email, otp)
    res.redirect('/otp')
}

const reSendOpt = (req, res) => {
    otp = otpGen()
    sMail(userDetails.email, otp)
    res.redirect('/otp')
}


///verify otp
const verifyOtp = async (req, res) => {
    try {
        let { val1, val2, val3, val4, val5, val6 } = req.body
        let formOtp = Number(val1 + val2 + val3 + val4 + val5 + val6)
       
        if (formOtp == otp) {
            let value = false;
            let { name, lname, password, Mobile, email } = userDetails

            const userAlready = await User.findOne({ email: email }).lean()

            if (userAlready) {
               res.render('user/signup',{message:"user already exsits",user:false,admin:false,value})

            } else {
                const sPassword = await securePassword(password)
                const user = new User({
                    firstName:name,
                    lastName:lname,
                    email:email,
                    mobile:Mobile,
                    password: sPassword,
                    admin: 0,
                });
                 user.save();
                res.render('user/signup', { message: "Your signup has been sucessfull Plese Login",user:false,admin:false ,value})


            }


        }
        else{
            
            res.render('user/otp',{user:false,admin:false,message :"Please enter valid OTP" })
        }
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }

}
// view the login page
const loginLoad = async (req, res) => {
    try {
        let session=req.session.user_id
        session = session ? true : false;
        res.render('user/login',{user:false,admin:false,session})
    }
    catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}

//Login verify

const loginVerify = async (req, res) => {
    try { 
        let session=req.session.user_id
        session = session ? true : false;
        if (!req.body.email && !req.body.password) {
            res.render('user/login', { message: 'plese filled in the feild',user:false ,admin:false})
        } else {
            let email = req.body.email
            let password = req.body.password
            let userdata = await User.findOne({ email: email })
            if (!userdata) {
                res.render('user/login', { message: 'cannot find the user' })
            } else {
                let passwordMatch = await bcrypt.compare(password, userdata.password)
                if (!passwordMatch) {
                    res.render('user/login', { message: 'Password is not correct',user:false,admin:false,session})
                } 
                else {
                    if(userdata.access==true)
                    {
                        req.session.user_id = userdata._id;
                        res.redirect('/home');
                    }
                    else{
                        res.render('user/login', { message: 'Your Account is Blocked',user:false,admin:false})
                    }
                    
                }
                
            }
        }
    }
    catch (error) {
      
        res.render('user/login', { message: 'please  fill the feild',user:false,admin:false });
    }
}

//user home page
const homePage = async (req, res) => {
    try {
        let session=req.session.user_id
        session = session ? true : false;
        const productDatas = await Product.find({status:true}).populate('category').populate('review');
        const bannerdata=await Banner.find({status:true})
        res.render('user/home',{user:true,admin:false,product:productDatas,bannerdata,session})
    }
    catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}

//User Log out
const userLogout = async (req, res) => {
    try {
        req.session.user_id=null;
        res.redirect('/login');
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}

//single products
const singleProduct=async(req,res)=>{
    try{
        let session=req.session.user_id
        session = session ? true : false;
        const id = req.query.id
        const productData = await Product.findOne({ _id: id }).populate('category').populate('review.user');
        res.render('user/singleproduct',{admin:false,user:true,product:productData,session})
      
    }
    catch(error){
        res.render('user/404error',{admin:false,user:false})
    }
}

//user profile
const loadUserProfile=async(req,res)=>{
    try {
        const user=req.session.user_id
        let session=req.session.user_id
        session = session ? true : false;
        const userdata=await User.findOne({_id:user}).lean();
        res.render('user/userProfile',{admin:false,user:true,userdata,session})
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}


module.exports = {
    loadRegister,
    loginLoad,
    loginVerify,
    homePage,
    userLogout,
    loadOtp,
    signupSubmit,
    verifyOtp,
    reSendOpt,
    singleProduct,
    loadUserProfile,
    

}