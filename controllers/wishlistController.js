
const User = require('../models/userSchema')
const Cart=require('../models/cartSchema')
const flash = require('express-flash')

const { ObjectId } = require('mongoose').Types;

module.exports = {

    getWishlist: async (req, res) => {

        const Id = req.session.userId
        const user = await User.findById(Id)
        
        if (user.Status === 'Active') {
        
            try {

                const userId = req.session.userId
                const user = await User.findOne({ _id: userId }).populate('Wishlist.productId')
                const carts=await Cart.findOne({userId:userId})
    
                res.render('./user/user-wishlist', { wishlist: user.Wishlist, user,carts })
            } catch (error) {
                console.log(error);
                res.status(500).render("error500", { message: "Internal Server Error" })
            }
        
        }else{
          console.log('this user are blocked ');
          
        }


       
    },


    getAddWishlist: async (req, res) => {


        const Id = req.session.userId
const user = await User.findById(Id)

if (user.Status === 'Active') {

    try {
        const { id } = req.params
        const userId = req.session.userId
        console.log('my userId',userId );

        const user = await User.findOne({ _id: userId })


        const isProductInWishlist = user.Wishlist.some(item => item.productId && item.productId.equals(id))

        if (isProductInWishlist) {
            req.flash('error', 'This item Allredy Existed ')
        } else {
            console.log("inside wishlist adding");

            const updatedUser = await User.findByIdAndUpdate(
                { _id: user._id },
                { $push: { Wishlist: { productId: id } } },
                { new: true } // Return the modified document rather than the original
            )

            if (updatedUser) {
                req.flash('success', 'Item successfully Added ')
                console.log('hay sa;ee;');
            } else {
                console.log(error);
                res.status(404).render("error-page", { message: "Failed to adding to wishlist" })
            }

        }

    } catch (error) {
        console.log(error);
        res.status(500).render("error500", { message: "Internal Server Error" })
    }

}else{
  console.log('this user are blocked ');
  
}

      
    },


    getRemoveItem: async (req, res) => {
        try {
            
            const { id } = req.params
            const SessionId = req.session.userId
        
            const user=await User.findOne({_id:SessionId})
   

            const updatedwishlist = await User.findByIdAndUpdate(
              
                 {_id:user._id},
                 { $pull: { Wishlist: { productId:id} } },
                 { new: true }
             )
      
             res.redirect("/wishlist");
         } catch (error) {
 
             console.log(error);
             res.status(500).render("error500", { message: "Internal Server Error" })
         }
     }

}