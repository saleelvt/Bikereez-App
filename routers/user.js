const express=require('express')
const router=express.Router()
const userController=require('../controllers/userController')
const cartController=require('../controllers/cartController')
const orderController=require("../controllers/orderController")
const walletController=require('../controllers/walletController')
const couponController=require('../controllers/couponController')
const paymentController=require('../controllers/paymentController')
const wishlisitController=require('../controllers/wishlistController')
const userAuth = require('../middleware/userAuth')


router.route('/')
.get(userController.initial)


router.route('/login')
.get(userAuth.userExist, userController.getLogin)
.post(userController.postLogin)

router.route('/homepage')
.get(userAuth.userTokenAuth, userController.userHome);

router.route('/signup')
.get(userAuth.userExist, userController.signup)
.post(userController.postSignup)

router.route('/emailVerification')
.get(userController.getemailVerification)
.post(userController.postEmailVerification)

router.route('/veiwProdectDetails/:id')
.get(userController.getProductViewDetails)


//------------------forgot password-------------------------------------------------

router.route('/forgotpassword')
.get(userController.forgotpassword)
.post(userController.postforgotpassword)

router.route('/forgotOtpVerification')
.get(userController.getForgotOtpVerification)
.post(userController.postForgotOtpVerification)

router.route('/forgotpassword')
.get(userController.forgotpassword)
.post(userController.forgotPasswordOtpAuth,userController.postforgotpassword)


router.route('/createNewPassword')
.get(userController.getCreateNewPassword)
.post(userController.postCreateNewPassword)






//  -----------------------------User PasswordChange route-----------------------------

router.route('/userChangePassword')
.get(userController.getUserChangePassword)
.post(userController.postUserChangePassword)







// ---------------signup---------------------------



router.route('/resendOtp')
.get(userController.resendOtp)
.post(userController.otpAuth)




// --------------------cart route ----------------------

router.route('/addToCart/:_id')
.get(userAuth.userTokenAuth,cartController.addToCart)

router.route('/cartPage') 
.get(userAuth.userTokenAuth,cartController.getCartPage)

router.route('/updateQuantity')
.post(userAuth.userTokenAuth,cartController.updateQuantity)

router.route('/removeCartItems/:id')
.get(cartController.removeCartItems)

router.route("/checkOut")
.get(cartController.checkOut)
.post(paymentController.postCheckOut)

router.route('/orderList')
.get(userAuth.userTokenAuth,orderController.getOrderList)

router.route('/cancelOrder/:id')
.get(orderController.getcancelOrder)

router.route('/userOrderDetailView/:id')
.get(userAuth.userTokenAuth,orderController.getUserOrderDetailView)

router.route('/returnOrder/:id')
.get(orderController.getReturnOrder)
.post(orderController.postReturnOrder)

router.route("/invoice/:id")
.get(orderController.downloadInvoice)







//-------------Wishlist route---------------

router.route('/wishlist')
.get(userAuth.userTokenAuth,wishlisitController.getWishlist)

router.route('/addWishlist/:id')
.get(wishlisitController.getAddWishlist)

router.route('/removefromWishlist/:id')
.get(wishlisitController.getRemoveItem)






// -----------------address route-----------

router.route('/userAddress')
.get(userController.getUserAddress)
.post(userController.postAddAddress)

router.route('/addAddress')
.get(userController.getAddAddress)

router.route('/deleteAddress/:id')
.get(userController.deleteAddress)

router.route('/editAddress/:id')
.get(userController.getEditAddress)
.post(userController.postEditAddress)


// ----------------- Wallet route----------

router.route('/userWallet')
.get(userAuth.userTokenAuth,walletController.getUserWallet)

router.route('/applyCoupon')
.post(userAuth.userTokenAuth,couponController.postApplyCoupon)


// <----------Payment route--------------->

router.route('/makePayment')
.get(userAuth.userTokenAuth,paymentController.getCreateOrder)

router.route('/verifyPayment')
.post(userAuth.userTokenAuth,paymentController.getVerifyPayment)

router.route('/onlineCheckOut')
.post(paymentController.postOnlineCheckOut)


// -----------filter and Search---------> 
router.route('/categoryFilter/:id')
.get(userController.getCategoryFilter)

router.route('/search')
.get(userController.getSearch)
// ----------- Profile ---------> 

router.route('/user-profile')
.get(userController.getUserProfile)

router.route('/user-referral')
.get(userAuth.userTokenAuth,userController.getUserReferral)

//-------------------logout----------------



router.route('/userlogout')
.get(userController.getLogout)





module.exports=router;
