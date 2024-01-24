const Razorpay = require('razorpay')
const Product = require('../models/productSchema')
const Brand = require('../models/brandSchema')
const Category = require("../models/cartSchema")
const Cart = require('../models/cartSchema')
const User = require('../models/userSchema')
const Order = require('../models/orderSchema')
const Wallet = require('../models/walletSchema')
const flash = require("express-flash")
const crypto = require("crypto")

const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env


var instance = new Razorpay({
    key_id: 'rzp_test_5R2m8IF7tYZkkO',
    key_secret: 'vEuAoYjZMP6ghEwU8P1tVbm5',
});


module.exports = {

    //online Payment Post for order creation
    postOnlineCheckOut: async (req, res) => {

        const Id = req.session.userId
const user = await User.findById(Id)

if (user.Status === 'Active') {

    try {
        const addressId = req.session.address   // ith shipping address ane
        const paymentMethod = req.body.payment //payment method from the body 
        let total = 0
        if (req.session.amounttopay === 0 || !req.session.amounttopay) {
            total = req.session.grantTotal          //total amount from session
        } else {
            total = req.session.amounttopay
        }

        // const total = req.session.grantTotal  //total amount from session
        const quantity = req.session.totalQuantity    //total quantity from session 
        const userId = req.session.userId     //user id from session

        const newUser = await User.findById({ _id: userId })
        const dbAddress = newUser.Address  // placing address id from user to db Address
        const newCart = await Cart.findOne({ userId: userId })  // user id vach nammal cart id edukkunnu

        const shipAddress = dbAddress.find((item) => item._id.equals(addressId)) //comparing shipping address from body with the db address id
        //updating the order in database            


        if (shipAddress) {

            const add = {

                Name: shipAddress.Name,
                AddressLane: shipAddress.AddressLane,
                Pincode: shipAddress.Pincode,
                City: shipAddress.City,
                State: shipAddress.State,
                Mobile: shipAddress.Mobile,
            }

            const newOrder = new Order({
                userId: userId,
                status: 'Order Placed',
                items: newCart.items,
                paymentMethod: 'Online',
                orderDate: new Date(),
                deliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),//four days (4 * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds).
                totalAmount: total,
                totalQuantity: quantity,
                paymentStatus: 'Paid',
                address: add
            })

            const currentOrder = await newOrder.save()
            await Cart.findByIdAndDelete({ _id: newCart._id }) //finding the card and deleting the cart 

            //updating the stock when order is placed (Importent)
            for (item of currentOrder.items) {

                const productId = item.productId
                const quantity = item.quantity
                const newProduct = await Product.findById(productId)

                if (newProduct) {
                    const newQuantity = newProduct.AvailableQuantity - quantity
                    if (newQuantity <= 0) {
                        newProduct.AvailableQuantity = 0
                        newProduct.Status = 'Out of Stock'
                        await newProduct.save()
                    }
                }
            }
            req.flash('success', "your order has been place succesfully. Please visit order tab for details")
            res.json({ success: true })
        } else {
            req.flash("error", "shipping address and payment method need not be blank")
            res.redirect("/checkOut")
        }

    } catch (error) {
        console.log(error);
        res.status(500).render("error500", { message: "Internal Server Error" })
    }

}else{
  console.log('this user are blocked ');
  
}
       
    },



    getCreateOrder: async (req, res) => {
        try {
            const addressID = req.query.addressID
            console.log('this is my address is ', addressID);
            const paymentMethod = req.query.paymentMethod

            req.session.address = addressID; // frond endil ninnum kittiya addreddid nammal session loot vekkkunnu 
            let total = 0
            if (req.session.amounttopay === 0 || !req.session.amounttopay) {
                console.log('code is here and :', req.session.grantTotal);
                total = req.session.grantTotal

            } else {
                total = req.session.amounttopay
            }
            var options = {
                amount: total * 100,
                currency: "INR",
                receipt: "order_rcptid_11",
            };
            const order = await instance.orders.create(options);
            return res.json({ success: true, order, messsge: '@@@@@' });
        } catch (error) {
            console.error(error);
            return res.status(500).send("Error in creating order");
        }
    },

    getVerifyPayment: async (req, res) => {
        let hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY);
        hmac.update(
            req.body.payment.razorpay_order_id +
            "|" +
            req.body.payment.razorpay_payment_id
        );
        hmac = hmac.digest("hex");

        if (hmac === req.body.payment.razorpay_signature) {
            const orderId = req.body.order.receipt;
            const orderID = req.body.orderId;
            // const updateOrderDocument = await order.findByIdAndUpdate(orderID, {
            //     PaymentStatus: "Paid",
            //     paymentMethod: "Online",
            // });           
            res.json({ success: true });
        } else {
            res.json({ failure: true });
        }


    },

    postCheckOut: async (req, res) => {

        const Id = req.session.userId
        const user = await User.findById(Id)
        
        if (user.Status === 'Active') {
        
            try {
          

                const addressId = req.body.address            //shipping address id from the body
                const paymentMethod = req.body.payment        //payment method from the body 
    
    
                let total = 0
                if (req.session.amounttopay === 0 || !req.session.amounttopay) {
                    total = req.session.grantTotal          //total amount from session
                } else {
                    total = req.session.amounttopay
                }
    
                const walletTotal =  req.session.walletAmount   //wallet total from the session
                console.log('walletTotal',walletTotal);
                const checkTotal = walletTotal - total           //total vs wallet amount check   
                console.log('checkTotal',checkTotal);
                console.log('total',total);
    
                const quantity = req.session.totalQuantity       //total quantity from session 
                const userId = req.session.userId                //user id from session
    
                const newUser = await User.findById({ _id: userId })     //finding user  
                const dbAddress = newUser.Address                     //placing address id from user to dbAddress
                const newCart = await Cart.findOne({ userId: userId })   //getting the cart id from user id     
                const shipAddress = dbAddress.find((item) => item._id.equals(addressId))    //comparing shipping address from body with the db address id
                //updating the order in database for COD
                
                const cartid = await Cart.findOne({ userId: userId })
                const user = await User.findById(userId)
                const carts = await Cart.findById(cartid)
    
                if (paymentMethod === 'walletPayment' && checkTotal < 0) {
                    req.flash("error", "you dont have enough balance in your wallet. pls try other payment method")
                    res.redirect("/cartPage")
                } else {
                    if (shipAddress && paymentMethod) {
                        const add = {
    
                            Name: shipAddress.Name,
                            AddressLane: shipAddress.AddressLane,
                            Pincode: shipAddress.Pincode,
                            City: shipAddress.City,
                            State: shipAddress.State,
                            Mobile: shipAddress.Mobile,
    
                        }
                        let method = "", pay = ""
                        if (paymentMethod == 'COD') {
                            method = 'COD'
                            pay = 'Pending'
                        } else {
                            method = "Wallet"
                            pay = "Paid"
                        }
                        const newOrder = new Order({
    
                            userId: userId,
                            status: "Order Placed",
                            items: newCart.items,
                            paymentMethod: method,
                            orderDate: new Date(),
                            deliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),//four days (4 * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds).
                            totalAmount: total,
                            totalQuantity: quantity,
                            paymentStatus: pay,
                            address: add
    
                        })
    
                        const currentOrder = await newOrder.save()
                        await Cart.findByIdAndDelete({ _id: newCart._id }) // find and delete
                        if (paymentMethod == 'walletPayment') {
                            const newWallet = new Wallet({
                                userId: userId,
                                orders: currentOrder._id,
                                status: "Debit",
                                totalAmount: currentOrder.totalAmount
                            })
                            await newWallet.save()
                        }
    
                        // stock updation
    
                        for(item of currentOrder.items){
                            const productId=item.productId
                            const quantity=item.quantity
                            const newProduct=await Product.findById(productId)
                            if(productId){
                                const newQuantity= newProduct.AvailableQuantity-quantity
                                if(newQuantity<=0){
                                    newProduct.AvailableQuantity=0
                                    newProduct.Status= "Out of Stock"
                                    await newProduct.save()
                                }else{
                                    newProduct.AvailableQuantity=newQuantity
                                    await newProduct.save()
                                }
                            }
                        }
                        req.flash("success", "your order has been place succesfully. Please visit order tab for details")
                        res.render("./user/orderSuccess" ,{user,carts})
                        delete req.session.amounttopay
    
                    }else{
                        req.flash("error", "shipping address and payment method need not be blank")
                        res.redirect("/checkOut")
                    }
                }
    
    
            } catch (error) {
                console.log(error);
                res.status(500).render("error500", { message: "Internal Server Error" })
            }
        
        }else{
          console.log('this user are blocked ');
          
        }


       
    }

}