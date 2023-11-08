

const isLogin = async(req,res,next)=>{
    try {
        if(req.session.user_id){
        } 
        else{
            res.redirect('/login')
        }
        next()     
    } catch (error) {
        console.log(error.message);   
    }
}

const islogOut = async(req,res,next)=>{
    try {
        if(req.session.user_id){
           res.redirect('/')
        }
        else{
           next()
        }  
    } catch (error) {
        console.log(error.message);  
    }
}
//--------------------------------------------------------------


const adminLogin = async(req,res,next)=>{
    try {
        if(req.session.isAdmin){
           
        } 
        else{
           return res.redirect('/admin/signin')
        }
        next()    
    } catch (error) {
        console.log(error.message);   
    }
}

const adminlogOut = async(req,res,next)=>{
    try {
        if(req.session.isAdmin){
           res.redirect('/admin/home')
        }
        else{
           next()
        }  
    } catch (error) {
        console.log(error.message);  
    }
}
//------------------------------------------






// const login=async(req,res,next)=>{
//     try{
//        if(req.session.user_id){

//        }else{
//         res.redirect('/');
//        }next()
//     }
//     catch(error){
//         console.log(error.message);
//     }
// }




// const logout=async(req,res,next)=>{
//     try{
//         if(req.session.user_id){
//          res.redirect('/');
//         }next()
//     }
//     catch(error){
//         console.log(error.message);
//     }
// }
module.exports={
    // login,
    // logout,
    isLogin,
    islogOut,
    adminLogin,
    adminlogOut
}