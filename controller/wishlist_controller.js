const Product = require('../model/productmodel')
const Whishlist = require('../model/wishlist-model')
const User = require('../model/user-model')


//vie wish list

const loadwishlist = async (req, res) => {
    try {
        const user = req.session.user_id
        let session=req.session.user_id
        session = session ? true : false;
        if (user) {
            const wishdata = await Whishlist.findOne({ user: user }).populate('product.productId').lean()
            const wishDatas = wishdata.product
            res.render('user/wishlist', { user: true, admin: false, wishDatas,session })
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}
//add whishlist
const addwishlist = async (req, res) => {
    try {
        const user = req.session.user_id
        const productid = req.query.id
        const values = { productId: productid }
        const wishdata = await Whishlist.findOne({ user: user });
        if (user) {
            if (wishdata) {

                const findwish = await Whishlist.findOne({ user: user });
                const find = findwish.product.find((value) => { return value.productId == productid })
                if (find) {

                    const wishlist = await Whishlist.findOneAndUpdate({ user: user },
                        { $pull: { product: { productId: productid } } },
                        { new: true }).then(() => {

                        })

                    res.json({ status: false })
                } else {
                    await Whishlist.findOneAndUpdate({ user: user }, {
                        $push: {
                            product: values
                        }
                    }).then((result) => {
                        res.json({ status: true })
                    });
                }

            } else {
                const newWishlist = new Whishlist({
                    user: user,
                    product: [{ productId: productid }],
                });
                const savedWishlist = await newWishlist.save().then((result) => {
                    console.log(result);
                    res.json({ status: true })
                })
            }
        }

    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
}

//delet wishlist
const deletewishlist = async (req, res) => {
    try {
        const user = req.session.user_id
        const productId = req.query.id;
        const wishlist = await Whishlist.findOneAndUpdate({ user: user },
            { $pull: { product: { productId: productId } } },
            { new: true }).then((result) => {

            })
        res.redirect('/wishlist');
    } catch (error) {
        res.render('user/404error',{admin:false,user:false})
    }
};


module.exports = {
    loadwishlist,
    addwishlist,
    deletewishlist
}





