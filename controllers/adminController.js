const Admin = require('../models/adminSchema');
const User=require("../models/userSchema")
const Order=require('../models/orderSchema')
const flash = require("express-flash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    // admin: async () => {
    //     try {
    //         const Name = 'saleel' //set the admin name
    //         const Email = 'saleelvt57@gmail.com'
    //         const Password = '000'
    //         const hashedPassword = await bcrypt.hash(Password, 10);
    //         const adminData = await Admin.create({ Name: Name, Email: Email, Password: hashedPassword })
    //         console.log("Admin is created");
    //         console.log(adminData);
    //         return adminData;
    //     } catch (error) {
    //         console.error('Error creation admin:', error);
    //         throw error
    //     }
    // },

    initial: (req, res) => {

        res.redirect('/admin/adminLogin')
    },
    getLogin: async (req, res) => {
        try {
            res.render('admin/adminLogin')
        } catch (error) {
            console.log(error);
        }
    },
    postLogin: async (req, res) => {
        try {
            const Email = req.body.Email;

            console.log("admin email is ", Email);

            const Password = req.body.Password;
            const admin = await Admin.findOne({ Email: Email })

            console.log("admin here", admin);

            if (admin.Status === 'Active') {
                const matchedPassword = await bcrypt.compare(Password, admin.Password);
                if (matchedPassword) {
                    const accessToken = jwt.sign(
                        { admin: admin._id },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: 60 * 60 }
                    );
                    // set both the admin name and id in the session
                    req.session.admin = {
                        _id: admin._id,
                        Name: admin.Name // include the name 
                    };
                    res.cookie('adminJwt', accessToken, { maxAge: 60 * 1000 * 60 })
                    res.redirect('/admin/admin-dashboard')
                } else {
                    console.log('Password not matched');
                    res.redirect('/admin/adminLogin')
                }
            } else {
                console.log('admin not active');
                res.redirect('/admin/adminLogin')
            }
        } catch (error) {
            console.log(error);
            res.redirect('/admin/adminLogin')
        }
    },

    getDashboard: async (req, res) => {
      
       
        res.render('admin/admin-dashboard') // pass name your template
    },

// user delete and bloke


    getUsers: async (req, res) => {
        try {
            
            const page = parseInt(req.query.page) || 1; // Get the page number from query parameters
            const perPage = 5; // Number of items per page
            const skip = (page - 1) * perPage;
            const users = await User.find({}).sort({ username: 1 }).skip(skip).limit(perPage)
            const totalCount = await User.countDocuments();
            res.render('admin/manageusers', {
                users,
                currentPage:page,
                perPage,
                totalCount,
                totalPages:Math.ceil(totalCount/perPage),
            })
        } catch (error) {
            res.send(error)
        }
    },

    blockUser: async (req, res) => {

        try{
            // request urllil ninnulla parameter aaya id ne extract cheyyunnu  
            const _id = req.params._id;
            console.log(_id);
            // extracted saanam vach chekk cheyyunnu
            const userData = await User.findOne({ _id: _id });
            console.log(userData);
 
            //user active aano aallayo nokunnu
            if (userData.Status === 'Active') {
                // If the user is active, update their status to "Blocked"
                const user = await User.findByIdAndUpdate(_id, { Status: 'Blocked' });
                const alertMessage = 'This user is being blocked';
                //set alert message in session for leter use 

                 req.session.alert = alertMessage;
                //redirect the user to the  /admin/userslist' page 
                res.redirect('/admin/userslist');
            }else if(userData.Status==='Blocked'){
                //if user is blocked  , update their status to 'active'
                const user =await User.findByIdAndUpdate(_id,{Status:'Active'})
                const alertMessage = "This user is being unblocked";
                res.redirect("/admin/userslist");
            }
        } catch (erorr) {
            // In case of an error, set a generic alert message
            const alertMessage = "This is an alert message.";
            req.session.alert = alertMessage;

            // Redirect the user to the "/admin/userslist" page
            res.redirect("/admin/userslist");
        }
    },





//<-------------------------------------------------- Admin order Controller ------------------------------------------------------>



getOrderList:async(req,res)=>{
   
    try {
        const page = parseInt(req.query.page) || 1; // Get the page number from query parameters
        const perPage = 5; // Number of items per page
        const skip = (page - 1) * perPage;
        // const brands = await Brand.find({}).sort({ Name: 1 }).skip(skip).limit(perPage);
        const totalCount = await Order.countDocuments();
        const orders=await Order.find().sort({orderDate:-1}).skip(skip).limit(perPage);
        console.log(orders);
        res.render('./admin/admin-OrderList',{orders,
            currentPage: page,
            perPage,
            totalCount,
            totalPages: Math.ceil(totalCount / perPage),})
    } catch (error) {
        console.log(error);
    }
},






    //logout controll...
    getAdminLogout: (req, res) => {
        req.session.admin = false;
        res.clearCookie('adminJwt');
        res.redirect('/admin/adminLogin')
    }

}































