
const Product = require('../models/productSchema')
const Brand = require('../models/brandSchema')
const Category = require("../models/cartSchema")
const Cart = require('../models/cartSchema')
const User = require('../models/userSchema')
const Order = require('../models/orderSchema')
const Wallet = require('../models/walletSchema')
const flash = require('express-flash')
const { generateInvoicePDF } = require("../utility/downloadInvoice");





module.exports = {

    getOrderList: async (req, res) => {

        const Id = req.session.userId
        const user = await User.findById(Id)



        if (user.Status === 'Active') {

            try {
                const userId = req.session.userId
                const email = req.session.user
                const user = await User.findOne({ Username: email })
                const carts = await Cart.findOne({ userId: userId })



                const orderList = await Order.find({ userId: userId }).sort({ orderDate: -1 })



                res.render('./user/user-order-list', {
                    orderList,
                    carts, user
                })
            } catch (error) {
                console.log(error);
            }

        } else {
            console.log('this user are blocked ');

        }


    },

    getOrderDetailView: async (req, res) => {
        try {
            const { id } = req.params
            const newOrders = await Order.findOne({ _id: id }).populate('items.productId')
            const Uid = req.session.userId
            const email = req.session.user
            const user = await User.findOne({ Username: email })
            const carts = await Cart.findOne({ userId: Uid })
            res.render('./admin/admin-order-detail', { newOrders, user, carts })
        } catch (error) {
            console.log(error);
        }
    },

    //admin order post for changing the status and wallet credit option

    postOrderDetailView: async (req, res) => {
        try {
            const { id } = req.params
            console.log('posst order id,', id);
            const userId = req.session.userId
            const value = req.body.status
            const reason = req.body.reason
            if (value === 'Shipped') {

                const updateOrderDocument = await Order.findByIdAndUpdate(id, {
                    status: 'Shipped'
                })
            } else if (value === 'Delivered') {
                const updateOrderDocument = await Order.findByIdAndUpdate(id, {
                    status: 'Delivered',
                    paymentStatus: 'paid'
                })
            } else if (value === 'reject') {
                const updateOrderDocument = await Order.findByIdAndUpdate(id, {
                    status: "Delivered",
                    adminReason: reason,
                    rejectedDate: new Date(),
                    returnStatus: value,
                    paymentStatus: "Refund"
                })


            } else if (value == "accept") {
                const updateOrderDocument = await Order.findByIdAndUpdate(id, {
                    status: "Returned",
                    adminReason: reason,
                    approvedDate: new Date(),
                    returnStatus: value,
                    paymentStatus: "Refund"
                });
                const orderToUpdate = await Order.findById({ _id: id })
                updateProduct = orderToUpdate.items
                for (const products of updateProduct) {
                    const dbProduct = await Product.findById(products.productId)
                    if (dbProduct) {
                        dbProduct.AvailableQuantity += products.quantity
                        if (dbProduct.AvailableQuantity > 0) {
                            dbProduct.Status = "In Stock"
                        }
                        await dbProduct.save()
                    }
                }
                const newWallet = new Wallet({
                    userId: userId,
                    orders: orderToUpdate._id,
                    status: 'Credit',
                    totalAmount: orderToUpdate.totalAmount
                })
                await newWallet.save()

            }
            console.log('dsfjkdjsjfds');
            res.redirect('/admin/admin-OrderList')

        } catch (error) {
            console.log(error);
            res.status(500).render("error500", { message: "Internal Server Error" })
        }

    },
    //admin side return order get
    getReturnPending: async (req, res) => {
        try {
            res.redirect("")

        } catch (error) {
            console.log(error)
            res.status(500).render("error500", { message: "Internal Server Error" })
        }
    },


    getUserOrderDetailView: async (req, res) => {

        try {
            const { id } = req.params
            const newOrders = await Order.findOne({ _id: id }).populate('items.productId')
            const Uid = req.session.userId
            const email = req.session.user
            const user = await User.findOne({ Username: email })
            const carts = await Cart.findOne({ userId: Uid })

            res.render('./user/user-order-list-detail', { newOrders, user, carts })

        } catch (error) {
            console.log(error);
            res.status(500).render("error500", { message: "Internal Server Error" })
        }

    },

    getcancelOrder: async (req, res) => {
        try {
            const { id } = req.params
            const userId = req.session.userId
            const orderToDelete = await Order.findById({ _id: id })
            if (orderToDelete.status === "Order Placed" || orderToDelete.status === 'Shipped') {

                updateProduct = orderToDelete.items
                for (const products of updateProduct) {
                    const dbproduct = await Product.findById(products.productId)
                    if (dbproduct) {
                        dbproduct.AvailableQuantity += products.quantity

                        if (dbproduct.AvailableQuantity > 0) {
                            dbproduct.Status = 'In Stock'
                        }
                        await dbproduct.save()
                    }
                }


                orderToDelete.status = "Cancelled"

                orderToDelete.returnDate = new Date()
                if (orderToDelete.paymentStatus === "Paid") {
                    orderToDelete.paymentStatus = "Refund"
                } else {
                    orderToDelete.paymentStatus = "No payment transaction"
                }
                await orderToDelete.save()

                let creditamount = orderToDelete.totalAmount

                if (orderToDelete.paymentMethod === "COD") {
                    creditamount = 0

                }

                console.log('my now order status is ', orderToDelete.paymentStatus);

                if (orderToDelete.paymentStatus === "Paid" || orderToDelete.paymentStatus === 'Refund') {
                    const newWallet = new Wallet({
                        userId: userId,
                        orders: id,
                        status: "Credit",
                        totalAmount: creditamount
                    })

                    await newWallet.save()
                }









                req.flash("success", "Order cancelled successfully")
                res.redirect("/orderList")
            } else {
                req.flash("error", "Something went wrong, try again")
                res.redirect("/admin-OrderList")
            }

        } catch (error) {
            console.log(error);
        }
    },

    getReturnOrder: async (req, res) => {
        try {
            const { id } = req.params
            const newOrders = await Order.findOne({ _id: id }).populate('items.productId')
            const Uid = req.session.userId
            const email = req.session.user
            const user = await User.findOne({ Username: email })
            const carts = await Cart.findOne({ userId: Uid })
            res.render('./user/user-return-page', { newOrders, user, carts })
        } catch (error) {
            console.log(error);
            res.status(500).render("error500", { message: "Internal Server Error" })
        }
    },

    postReturnOrder: async (req, res) => {
        try {
            const { id } = req.params
            const Reason = req.body.reason
            const todayDate = Date.now()
            await Order.findByIdAndUpdate({ _id: id }, {
                userReason: Reason,
                status: "Return Pending",
                returnDate: todayDate
            })
            req.flash('success', 'Return Request Successfully Send')
            res.redirect("/orderList")

        } catch (error) {
            console.log(error)
            res.status(500).render("error500", { message: "Internal Server Error" })
        }
    },
    downloadInvoice: async (req, res) => {
        try {

            const { id } = req.params
            const uesrId = req.session.userId
            const orderDetails = await Order.findOne({ _id: id }).populate("items.productId")
            const userData = await User.findOne({ _id: uesrId })
            let result = await generateInvoicePDF(orderDetails, userData);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=Invoice.pdf"
            );

            res.status(200).end(result);
            console.log(orderDetails.items[0], "orderssssssssssssssss");


        } catch (error) {
            console.log(error)
            res.status(500).render("error500", { message: "Internal Server Error" })
        }
    }





























}
