
const Order = require('../models/orderSchema')
const Wallet = require('../models/walletSchema')
const Product = require("../models/productSchema")
const User = require('../models/userSchema')
const Cart = require('../models/cartSchema')

module.exports = {

    getUserWallet: async (req, res) => {

        const Id = req.session.userId
const user = await User.findById(Id)

if (user.Status === 'Active') {

    try {


        const userId = req.session.userId
        const newWallet = await Wallet.find({ userId: userId }).populate('orders')
        const email = req.session.user
        const user = await User.findOne({ Username: email })
        const carts = await Cart.findOne({ userId: userId })


        const page = parseInt(req.query.page) || 1; // Get the page number from query parameters
        const perPage = 5; // Number of items per page
        const skip = (page - 1) * perPage;
        const totalCount = await Wallet.countDocuments();
        const walletList = await Wallet.find().sort({ orderDate: -1 }).skip(skip).limit(perPage);



        let debitAmount = 0, creditAmount = 0, walletTotal = 0, totalAmount = 0
        console.log('new wallet', newWallet);


        for (x of newWallet) {
            if (x.status === 'Debit') {
                debitAmount += x.totalAmount

            } else if (x.status === 'Credit') {
                creditAmount += x.totalAmount
            }
        }
        const walletAmounts = await User.findOne({ _id: userId })

        let reffAmount = walletAmounts.ReferedAmount


        walletTotal = creditAmount + reffAmount - debitAmount
        console.log('reff', reffAmount, 'ewllae total', walletTotal);
        req.session.walletAmount = walletTotal

        res.render('./user/user-wallet', {
            newWallet,
            walletTotal,
            reffAmount,
            user,
            carts,
            walletAmounts,

            currentPage: page,
            perPage,
            totalCount,
            totalPages: Math.ceil(totalCount / perPage),
            walletList
        })

    } catch (error) {
        console.log(error);
        res.status(500).render("error500", { message: "Internal Server Error" })
    }

}else{
  console.log('this user are blocked ');
  
}
       
    },


}

