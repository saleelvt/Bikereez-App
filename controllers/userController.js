const User = require('../models/userSchema')
const Category = require('../models/categorySchema')
const Product = require('../models/productSchema')
const Brand = require('../models/brandSchema')
const Cart = require('../models/cartSchema')
const Wallet = require('../models/walletSchema')
const Order = require('../models/orderSchema')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const flash = require("express-flash")
const session = require('express-session');
const otpVerification = require('../utility/otpVerification');
const OTP = require('../models/otpSchema');
const { render } = require('ejs');
require('dotenv').config()

module.exports = {

  initial: async (req, res) => {
    try {

      const categories = await Category.find();
      const products = await Product.find({ Display: "Active" })
      res.render('user/user-welcome', { categories, products })

    } catch (error) {
      console.log(error);
    }
  },

  // --------------------------------login------------------------------------

  getLogin: async (req, res) => {

    res.render('user/loginpage-user')

  },

  forgotpassword: async (req, res) => {
    res.render("user/forgotPassword", {
      messages: req.flash(), user: req.session.user
    });
  },





  postforgotpassword: async (req, res) => {
    try {
      req.session.Email = req.body.Email;
      const Email = req.body.Email;
      const userData = await User.findOne({ Email: Email });
      console.log("user email is :", userData)
      if (userData) {
        if (userData.Status === 'Active') {
          otpToBeSent = otpVerification.generateOTP();
          const result = otpVerification.passwordSendOtp(req, res, Email, otpToBeSent);
        } else {
          req.flash("error", "Email is BLocked ");
          res.redirect("/forgotpassword")
        }
      } else {
        req.flash("error", "Email Not Registesred");
        res.redirect("/forgotpassword")
      }
    } catch (error) {
      console.log(error);
      res.redirect("/login")
    }
  },

  getForgotOtpVerification: async (req, res) => {

    try {
      const Email = req.session.Email
      console.log(Email);
      setTimeout(() => {
        OTP.deleteOne({ Email: Email })
          .then(() => {
            console.log("Document deleted successfully");
          })
          .catch((err) => {
            console.error(err);
          });
      }, 60000);
      res.render('./user/otpVerification')
    } catch (error) {
      console.log(error);
      res.redirect("/login");
    }
  },

  forgotPasswordOtpAuth: async (req, res, next) => {


    try {
      let { otp } = req.body
      // Ensure an OTP record exists for the email
      console.log(req.session.Email);
      const matchedOTPrecord = await OTP.findOne({
        Email: req.session.Email,
      });
      if (!matchedOTPrecord) {
        throw new Error('No Otp recorded provided email  ')
      }
      const { expiresAt } = matchedOTPrecord;
      console.log("Expires At:", expiresAt);
      if (expiresAt) {
        if (expiresAt < Date.now()) {
          await OTP.deleteOne({ Email: Email });
          throw new Error("The OTP code has expired. Please request a new one.");
        }
      } else {
        console.log('ExpiresAt is not defined in the otp record');
      }
      console.log("Stored OTP from the database:", matchedOTPrecord.otp);

      if (Number(otp) === matchedOTPrecord.otp) {
        req.session.OtpValid = true
        next()
      } else {
        console.log("Entered OTP does not match stored OTP.");
        req.flash("error", "Invalid OTP. Please try again.");
        res.redirect('/forgotOtpVerification')
      }
    } catch (error) {
      console.error(error);
      res.redirect("/login");
    }
  },



  postForgotOtpVerification: async (req, res) => {
    try {

      const email = req.session.Email

      const newUser = await OTP.findOne({ Email: email })


      if (newUser) {

        const checkOTP = req.body.otp
        if (Number(checkOTP) === newUser.otp) {

        } else {
          req.flash("error", "OTP Miss Match, Pls try again")
          res.redirect("/forgotOtpVerification")
        }
      } else {
        req.flash("error", "OTP Expired")
        res.redirect("/forgotOtpVerification")
      }

      res.redirect('/createNewPassword')
    } catch (error) {
      console.log(error);
      res.redirect("/login");
    }
  },

  getCreateNewPassword: async (req, res) => {
    const Id = req.session.userId
    const user = await User.findById(Id)

    if (user.Status === 'Active') {

      try {
        res.render('./user/resetpassword')
      } catch (error) {
        console.log(error);
      }

    }else{
      console.log('this user are blocked ');
      
    }
   


  },

  postCreateNewPassword: async (req, res) => {

    try {
      const email = req.session.Email
      console.log('my email is ', email);
      const { Password, confirmPassword } = req.body
      if (Password === confirmPassword) {
        console.log(req.body);
        const hashPassword = await bcrypt.hash(Password, 10)
        await User.findOneAndUpdate({ Email: email }, { $set: { Password: hashPassword } })
        req.session.destroy()
        res.redirect('/login')

      } else {
        req.flash("error", "Password doesnot matched")
        res.redirect("/forgotpassword")
      }
    } catch (error) {
      console.log(error);
    }




  },




  postLogin: async (req, res) => {

    try {

      console.log('code is he');
      // bodynn email edukkunnu
      const email = req.body.Email
      req.session.user = email
      const user = await User.findOne({ Email: email })
      const password = req.body.Password;
      // thanna emailil ulla aale undo  nokkunu

      // user active ano ennum status active ano ennum check cheyyunnu

      if (user) {
        if (user.Status === 'Active') {
          // thanna passwordum  pinne user aathyam kodutha passwordum thammil nokkunnu
          const passwordMatch = await bcrypt.compare(password, user.Password)
          if (passwordMatch) {

            const accessToken = jwt.sign(
              { user: user._id },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: '1h' } // Set the expiration time as needed
            )

            // Set the JWT as a cookie.
            res.cookie('userJwt', accessToken, { maxAge: 60 * 60 * 1000 });

            // userinte details sessionil store cheyyunnu
            req.session.user = user.Email

            req.session.userId = user._id

            console.log(req.session.user, 'it is ', req.session.userId);
            // Redirect to the user's homepage.

            return res.redirect('/homepage');
          }
        } else {
          // pass match aalengil

          req.flash('error', 'User is Blocked')
          return res.redirect('/login')
        }
      } else {
        // If no user is found, show an error and redirect to the login page.
        req.flash('error', 'User Email is NOT Verified So please Verify With OTP');
        return res.redirect('/login');
      }







    } catch (error) {
      //  handle any error  proccess cheyyumbol
      console.error(error);
      req.flash('error', 'An error occurred during login');
      res.redirect('/login');
    }


  },

  userHome: async (req, res) => {
    const Id = req.session.userId
    const user = await User.findById(Id)

    if (user &&  user.Status && user.Status === 'Active') {

      try {


        const userId = req.session.userId
        const newWallet = await Wallet.find({ userId: userId }).populate('orders')
        let debitAmount = 0, creditAmount = 0, walletTotal = 0
    
        for (x of newWallet) {
          if (x.status === "Debit") {
            debitAmount += x.totalAmount
          } else if (x.status === "Credit") {
            creditAmount += x.totalAmount
          }
        }
        walletTotal = creditAmount - debitAmount
        req.session.walletAmount = walletTotal
    
        const categories = await Category.find({});
        const brands = await Brand.find({})
        const category = await Category.find({ status: 'Active' })
        const products = await Product.find({ Display: 'Active' })
    
    
        const cartid = await Cart.findOne({ userId: userId })
        const user = await User.findById(userId)
        const carts = await Cart.findById(cartid)
    
    
    
        console.log('req.session', req.session);
        res.render("user/user-home", { categories, products, brands, user, carts });
      } catch (error) {
        console.log(error);
      }
    

    }else{
      console.log('this user are blocked ');
     
    }

  },




  getProductViewDetails: async (req, res) => {

    const _id = req.params.id; // Use req.params.id
    const categories = await Category.find();
    const brands = await Brand.find();
    const Uid = req.session.userId


    const email = req.session.user
    const user = await User.findOne({ Username: email })
    const carts = await Cart.findOne({ userId: Uid })
    const product = await Product.findOne({ _id }).populate('Category BrandName');
    totalQuantity = req.session.totalQuantity


    res.render('./user/productpage', {
      product,
      categories,
      brands,
      totalQuantity,
      user,
      carts

    });




  },







  // ------------------------------------------------User Change Password -------------------------------------------------


  getUserChangePassword: async (req, res) => {

    try {


      const Uid = req.session.userId
      const email = req.session.user
      const user = await User.findOne({ Username: email })
      const carts = await Cart.findOne({ userId: Uid })
      res.render('./user/userPasswordChange', { user, carts })
    } catch (error) {
      console.log(error);
    }
  },

  postUserChangePassword: async (req, res) => {
    try {

      const { password, newpassword, confirmpassword } = req.body
      const newemail = req.session.user
      const newUser = await User.findOne({ Email: newemail })
      const passwordMatch = await bcrypt.compare(password, newUser.Password)
      if (passwordMatch == false) {
        req.flash("error", "current password doesnot match")
        res.redirect("/userPasswordChange")
      } else if (newpassword === confirmpassword && password != newpassword) {
        const hashPassword = await bcrypt.hash(newpassword, 12)
        await User.findOneAndUpdate({ Email: newUser.Email }, { $set: { Password: hashPassword } })
        req.flash("success", "Password changed successfully")
        res.redirect("/homepage")
      } else {
        req.flash("error", "current password and new password are same")
        res.redirect("/userPasswordChange")
      }
    } catch (error) {
      console.log(error);
    }
  },











  // ---------signup route---------

  signup: (req, res) => {

    try {
      const referral = req.query.ref
      if (referral) {
        req.session.referral = referral
      }

      if (!req.session.user) {
        res.render('user/signup')
      } else {

        res.render('./user/signup')
      }
    } catch (error) {
      console.log(error)
      res.status(500).render("error500", { message: "Internal Server Error" })
    }

  },

  postSignup: async (req, res) => {

    try {

      const saltRounds = 10
      const salt = await bcrypt.genSalt(saltRounds)
      const username = req.body.Username;
      const password = req.body.Password;
      const confirmPassword = req.body.confirmPassword

      if (password && confirmPassword) {
        const hashedPassword = await bcrypt.hash(password, salt)
        const hashedConfirmPassword = await bcrypt.hash(confirmPassword, salt);
        // Log the hashed password and hashedConfirmPassword
        console.log('Hashed Password:', hashedPassword);
        console.log('Hashed Confirm Password:', hashedConfirmPassword);

        const email = req.body.Email;

        req.session.user = {

          Username: username,
          Email: email,
          Password: hashedPassword

        };

        const existingUser = await User.findOne({ Email: email })

        if (existingUser) {
          req.flash('error', 'Email alredy exitsts');
          console.log('email alredy existed ')
          res.redirect('/signup')
        } else {
          otpToBeSent = otpVerification.generateOTP()
          const result = otpVerification.sendOTP(req, res, email, otpToBeSent)
        }
        // 2 passwords match aanonn nokunnu
        if (hashedPassword === hashedConfirmPassword) {
          console.log('Password and ConfirmPassword match.');
        } else {
          console.log('Password and ConfirmPassword do not match.');
        }
      } else {

        req.flash('error', 'Passwords are missing');
        res.redirect('/signup');
      }
    } catch (error) {
      console.log(error);
      req.flash('error', 'An error occurred during signup')
      res.redirect('/signup')
    }
  },

  getemailVerification: async (req, res) => {
    try {
      // email is taken from the input 
      const Email = req.session.user.Email
      // a timeout function to deleted the old otp after 1 minute

      setTimeout(() => {
        OTP.deleteOne({ Email: Email })
          .then(() => {
            console.log('document deleted successfully');
          })
          .catch((err) => {
            console.log(err);
          })
      }, 60000);
      res.render('user/emailVerification', { messages: req.flash(), user: '' })
    } catch (error) {
      console.log(error);
      res.redirect('/signup')
    }
  },

  otpAuth: async (req, res, next) => {

    try {
      const { otp } = req.body;
      const Email = req.session.user.Email;
      console.log("User-provided OTP:", otp);
      console.log("Email:", Email);
      // Check for an OTP record in the database
      const matchedOTPrecord = await OTP.findOne({
        Email: Email,
      })
      console.log("Matched OTP record from the database:", matchedOTPrecord);

      if (!matchedOTPrecord) {
        throw new Error("No OTP records found for the provided email.");
      }
      const { expiresAt } = matchedOTPrecord;
      console.log("Expires At:", expiresAt);
      if (expiresAt) {
        if (expiresAt < Date.now()) {
          await OTP.deleteOne({ Email: Email })
          throw new Error('The otp code has expired /p;ease request a new one')
        }
      } else {
        console.log('ExpiresAt is not defined in the OTP record ');
      }
      console.log("Stored OTP from the database:", matchedOTPrecord.otp);

      if (Number(otp) === matchedOTPrecord.otp) {
        req.session.OtpValid = true;
        next();
      } else {
        console.log("Entered OTP does not match stored OTP.")
        req.flash("error", "Invalid OTP. Please try again.");
        res.redirect("/emailVerification");
      }

    }
    catch (error) {
      console.error(error);
      res.redirect("/emailverification");
    }
  },
  postEmailVerification: async (req, res) => {
    try {
      const userData = await User.create(req.session.user);
      const referralUser = await User.findOne({ Email: userData.Email })
      const id = referralUser._id
      const refarrelId = req.session.referral
      await User.findByIdAndUpdate(id, { $set: { ReferredBy: refarrelId } })
      const updatedUser = await User.findOne({ _id: refarrelId })


      if (updatedUser) {

        const referedAmount = updatedUser.ReferedAmount || 0; // Assuming a default value of 0
        total = referedAmount + 100
        const newupdateUser = await User.findByIdAndUpdate(
          refarrelId,
          { $set: { ReferedAmount: total } }
        );
        const newupdateUser1 = await User.findByIdAndUpdate(
          refarrelId,
          { $push: { referredUsers: id } }
        );


      }
      if (userData) {

        const accessToken = jwt.sign(
          { user: userData._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: 60 * 60 }
        )
        console.log('not need the homepage');
        // set the cookie before sending any response
        res.cookie("userjwt", accessToken, { maxAge: 60 * 1000 * 60 });
        // Then redirect to the ajax
        res.redirect('/login');


      } else {
        req.flash("error", "Invalid Email Address");
        console.log("Invalid Email Address");
        res.redirect('/signup');
      }
    } catch (error) {
      console.log(error);
      res.redirect('/signup')
    }
  },


  resendOtp: async (req, res) => {
    try {
      const duration = 60;
      const Email = req.session.user.Email;
      otpToBeSent = otpVerification.generateOTP();
      const result = otpVerification.sendOTP(req, res, Email, otpToBeSent);
    }
    catch (error) {
      console.log(error);
      req.flash("error", "error sending OTP");
      res.redirect("/emailVerification");
    }
  },









  // ---------------------------------------Address Controrller----------------------------------------------


  getUserAddress: async (req, res) => {

    const Id = req.session.userId
    const user = await User.findById(Id)
    
    if (user.Status === 'Active') {
      try {

        const id = req.session.userId
        const user = await User.findOne({ _id: id })
        const carts = await Cart.findOne({ userId: id })
        const newUser = await User.findOne({ _id: id })
  
  
  
        const page = parseInt(req.query.page) || 1; // Get the page number from query parameters
        const perPage = 5; // Number of items per page
        const skip = (page - 1) * perPage;
        const totalCount = await User.countDocuments();
        const orderList = await User.find().sort({ orderDate: -1 }).skip(skip).limit(perPage);
  
  
  
  
        console.log('id is', id, 'newUser', newUser);
        const addresses = newUser.Address
        res.render('./user/userAddress', {
          addresses, user, carts, currentPage: page,
          perPage,
          totalCount,
          totalPages: Math.ceil(totalCount / perPage),
        })
  
      } catch (error) {
        console.log(error);
      }
     
    
    }else{
      console.log('this user are blocked ');
      
    }

   
  },



  getAddAddress: async (req, res) => {
    try {

      const id = req.session.userId
      const email = req.session.user
      const user = await User.findOne({ Username: email })
      const carts = await Cart.findOne({ userId: id })
      res.render('./user/userAddAddress', { user, carts })


    } catch (error) {
      console.log(error)
    }
  },

  postAddAddress: async (req, res) => {
    const Id = req.session.userId
const user = await User.findById(Id)

if (user.Status === 'Active') {

  try {
    const name = req.body.name
    const userId = req.session.userId


    const AddressData = {

      Name: req.body.name,
      AddressLane: req.body.houseName,
      City: req.body.city,
      Pincode: req.body.pincode,
      State: req.body.state,
      Mobile: req.body.mobile,


    }
    const user = await User.findOne({ _id: userId })

    if (user) {
      user.Address.push(AddressData)
      await user.save();
      req.flash("success", "Address added successfully")
      res.redirect("/userAddress")
    }
  } catch (error) {
    console.log(error);
  }


}else{
  console.log('this user are blocked ');
  
}
  
  },

  getEditAddress: async (req, res) => {

    const Id = req.session.userId
const user = await User.findById(Id)

if (user.Status === 'Active') {

  try {
    const { id } = req.params
    const Uid = req.session.userId
    const user = await User.findOne({ _id: Uid })
    const carts = await Cart.findOne({ userId: Uid })
    const newUser = await User.findOne({ _id: Uid })
    const addresses = newUser.Address.id(id)
    res.render('./user/userEditAddress', { addresses, user, carts })
  } catch (error) {
    console.log(error);
  }

}else{
  console.log('this user are blocked ');
  
}
   
  },



  postEditAddress: async (req, res) => {

    const Id = req.session.userId
const user = await User.findById(Id)

if (user.Status === 'Active') {

  try {
    const { id } = req.params
    const userId = req.session.userId

    const newUser = await User.findOne({ _id: userId })
    const editedAddress = newUser.Address.id(id)


    editedAddress.Name = req.body.name,
      editedAddress.AddressLane = req.body.houseName,
      editedAddress.City = req.body.city,
      editedAddress.Pincode = req.body.pincode,
      editedAddress.State = req.body.state,
      editedAddress.Mobile = req.body.mobile

    await newUser.save()

    req.flash('Success', 'Address updated succcessfully....')
    res.redirect("/userAddress")


  } catch (error) {
    console.log(error);
  }

}else{
  console.log('this user are blocked ');
  
}
   
  },

  deleteAddress: async (req, res) => {


    const Id = req.session.userId
const user = await User.findById(Id)

if (user.Status === 'Active') {

  try {

    const { id } = req.params
    const userid = req.session.userId
    const newUser = await User.findOne({ _id: userid })
    const userId = newUser._id
    const deleteAddress = await User.findByIdAndUpdate({ _id: userId }, { $pull: { Address: { _id: id } } })
    res.redirect('/userAddress')

  } catch (error) {
    console.log(error);
  }

}else{
  console.log('this user are blocked ');
  
}
   
  },


  getCategoryFilter: async (req, res) => {



    try {
      const { id } = req.params
      const brand = await Brand.find({})
      const newcategory = await Category.find({})
      const newproduct = await Product.find({ Category: id })
      const Uid = req.session.userId
      const email = req.session.user
      const user = await User.findOne({ Username: email })
      const carts = await Cart.findOne({ userId: Uid })
      res.render("./user/filtered-shop", { newproduct, newcategory, brand, user, carts })
    } catch (error) {
      console.log(error)
      res.status(500).render("error500", { message: "Internal Server Error" })
    }
  },

  getSearch: async (req, res) => {



    try {
      const { searchNames } = req.query;

      console.log('Search names:', searchNames);
      const products = await Product.find()
      const Uid = req.session.userId
      const email = req.session.user
      const user = await User.findOne({ Username: email })
      const carts = await Cart.findOne({ userId: Uid })

      const filteredProducts = products.filter(product => {
        const productName = product.ProductName.trim().toLowerCase()

        return searchNames.split(',').some(searchName => productName.includes(searchName.trim().toLowerCase()))

      })

      res.render('user/searched-product', { user: req.session.user ?? null, products: filteredProducts, user, carts });
    } catch (error) {
      console.log(error);
      res.status(500).render("error500", { message: "Internal Server Error" })
    }
  },

  getUserProfile: async (req, res) => {

    const Id = req.session.userId
const user = await User.findById(Id)

if (user.Status === 'Active') {

  try {
    const use = req.session.user
    const Uid = req.session.userId

    const user = await User.findOne({ Username: use })
    const carts = await Cart.findOne({ userId: Uid })
    const newUser = await User.findOne({ _id: Uid })


    res.render('./user/user-profile', { newUser, user, carts })

  } catch (error) {
    console.log(error);
    res.status(500).render("error500", { message: "Internal Server Error" })
  }

}else{
  console.log('this user are blocked ');
  
}
   
  },

  getUserReferral: async (req, res) => {

    const Id = req.session.userId
const user = await User.findById(Id)

if (user.Status === 'Active') {

  try {


    const Uid = req.session.userId
    const user = await User.findOne({ _id: Uid })
    const carts = await Cart.findOne({ userId: Uid })
    const newuser = await User.findOne({ _id: Uid }).populate('referredUsers')




    const page = parseInt(req.query.page) || 1; // Get the page number from query parameters
    const perPage = 5; // Number of items per page
    const skip = (page - 1) * perPage;
    const totalCount = await User.countDocuments();
    const orderList = await User.find().skip(skip).limit(perPage);





    res.render('./user/user-referral', {
      user, carts, newuser,
      currentPage: page,
      perPage,
      totalCount,
      totalPages: Math.ceil(totalCount / perPage), orderList
    })

  } catch (error) {
    console.log(error);
    res.status(500).render("error500", { message: "Internal Server Error" })
  }

}else{
  console.log('this user are blocked ');
  
}
   
  },


  getLogout: async (req, res) => {
    req.session.user = false;
    req.session.destroy()
    res.clearCookie('userJwt');
    res.redirect('/login')
  }

}