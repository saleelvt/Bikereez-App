const { render } = require('ejs');
const Cart = require('../models/cartSchema')
const User = require('../models/userSchema')
const Product = require('../models/productSchema')
const Coupon = require('../models/coupenSchema')
const flash = require("express-flash")
const mongoose = require('mongoose')

module.exports = {



    getCartPage: async (req, res) => {

        const idv = req.session.userId
        const id =req.session.userId
        const nowuUser = await User.findOne({ _id: idv })
        if (nowuUser.Status === 'Active') {
            try {

                const newCart = await Cart.findOne({ userId: id }).populate("items.productId")
                const user = await User.findOne({ _id: id })
                const carts = await Cart.findOne({ userId: id })



                let total = 0
                let totalQuantity = 0
                if (newCart) {
                    newCart.items.forEach((item => {

                        total += item.quantity * (item.productId.DiscountAmount)
                        totalQuantity += item.quantity


                        req.session.grantTotal = total         // session liloot eduthu vekkunnu
                        req.session.totalQuantity = totalQuantity//  session loot quantity eduttu vekkunnu


                    }))
                    res.render("./user/cartPage", { newCart, total, totalQuantity, user, carts })
                } else {
                    res.render("./user/cartPage", { newCart, total, totalQuantity, user, carts })
                }

            } catch (error) {
                console.log(error);
            }
        } else {
            console.log('This user now blocked');
        

        }


    },


    addToCart: async (req, res) => {


        const Id = req.session.userId
        const user = await User.findById(Id)

        if (user.Status === 'Active') {

            try {

                const id = req.params._id;
                const userId = req.session.userId
                const newProduct = await Product.findOne({ _id: id });
                const stock = newProduct.AvailableQuantity;
                const check = await Cart.findOne({ userId: userId });


                if (!newProduct) {
                    return res.status(404).json({ error: 'Product not found' });

                }
                if (check !== null) {
                    let currentCart = check.items.find((item) => {
                        return item.productId.equals(id);
                    });

                    if (currentCart) {
                        if (currentCart.quantity < stock) {
                            currentCart.quantity += 1;
                        } else {
                            return res.json({});
                        }
                    } else {
                        if (stock > 0) {
                            check.items.push({ productId: id, quantity: 1 });

                            console.log('item second time pushed ');
                        } else {
                            return res.json({});
                        }
                    }

                    await check.save()
                    res.json({

                        success: true,
                    })
                } else {
                    if (stock > 0) {

                        const newCart = new Cart({
                            userId: userId,
                            items: [{ productId: id, quantity: 1 }],
                        });

                        await newCart.save();

                        console.log(' Item succssesfully  saved');
                        return res.json({
                            success: true,
                        });
                    } else {
                        return res.json({});
                    }
                }
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

        } else {
            console.log('this user are blocked ');

        }



    },

    updateQuantity: async (req, res) => {

        const Id = req.session.userId
        const user = await User.findById(Id)

        if (user.Status === 'Active') {

            try {
                console.log('code is here');
                const { productId, quantity, carts } = req.body
                console.log(req.body);
                const email = req.session.user
                const newUser = await User.findOne({ Email: email })
                const dbproduct = await Product.findOne({ _id: productId })
                const dbstock = dbproduct.AvailableQuantity
                const newCart = await Cart.findOne({ _id: carts }).populate('items.productId')



                if (quantity > dbstock) {
                    res.json({})
                } else {
                    const productInCart = newCart.items.find((item) => item.productId.equals(productId))
                    productInCart.quantity = quantity
                    await newCart.save()
                    res.json({
                        success: true
                    })
                }
            } catch (error) {
                console.log(error);
            }

        } else {
            console.log('this user are blocked ');

        }


    },





    removeCartItems: async (req, res) => {



        const Id = req.session.userId
        const user = await User.findById(Id)

        if (user.Status === 'Active') {

            try {

                const { id } = req.params
                const userid = req.session.userId

                const newUser = await User.findOne({ _id: userid })
                const userId = newUser._id
                const delItem = await Cart.findOneAndUpdate({ userId: userId }, { $pull: { items: { productId: id } } }, { new: true })
                console.log('item successfully deleted');
                res.redirect('/cartPage')
            } catch (error) {

                console.log(error);
            }


        } else {
            console.log('this user are blocked ');

        }



    },

    checkOut: async (req, res) => {


        const Id = req.session.userId
        const user = await User.findById(Id)
        
        if (user.Status === 'Active') {
        
            try {
                const id = req.session.userId
    
                const user = await User.findOne({ _id: id })
                const carts = await Cart.findOne({ userId: id })
                const newUser = await User.findOne({ _id: id })
    
                const address = newUser.Address
                const total = req.session.grantTotal
                const quantity = req.session.totalQuantity
    
                let newCoupon = []
    
                if (total >= 15000 && total <= 50000) {
                    newCoupon = await Coupon.find({ discount: { $gte: 5, $lt: 10 } })
    
    
                } else if (total >= 30000 && total <= 90000) {
                    newCoupon = await Coupon.find({ discount: { $gte: 10, $lt: 15 } })
                }
                res.render("./user/checkOut", { address, total, quantity, newCoupon, user, carts })
            } catch (error) {
                console.log(error);
                res.status(500).render("error500", { message: "Internal Server Error" })
            }
        
        }else{
          console.log('this user are blocked ');
          
        }


       

    }




















}




