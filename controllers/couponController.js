const Coupon = require('../models/coupenSchema')
const User = require('../models/userSchema')
const flash = require('express-flash')




module.exports = {

    getAdmincCoupon: async (req, res) => {

        try {
            const page = parseInt(req.query.page) || 1; // Get the page number from query parameters
            const perPage = 5; // Number of items per page
            const skip = (page - 1) * perPage;
            const newCoupons = await Coupon.find({}).sort({ discount: 1 }).skip(skip).limit(perPage);
            const totalCount = await Coupon.countDocuments();
            res.render('./admin/admin-coupon', { newCoupons,
                currentPage: page,
                perPage,
                totalCount,
                totalPages: Math.ceil(totalCount / perPage),  })
        } catch (error) {
            console.log(error);
            res.status(500).render("error500", { message: "Internal Server Error" })
        }
    },

    getAddCoupon: async (req, res) => {
        try {

            res.render('./admin/admin-add-coupon')
        } catch (error) {
            console.log(error);
            res.status(500).render("error500", { message: "Internal Server Error" })
        }
    },
    postAddCoupon: async (req, res) => {
        try {

            const codename = req.body.code
            const testCoupon = await Coupon.findOne({ couponCode: codename })
            console.log(testCoupon);
            console.log(codename);

            if (testCoupon) {
                console.log('coupon allredy inside');
                req.flash("error", "Coupon Already Exists....")
                res.redirect("/addCoupon")
            } else {

                const newCoupon = new Coupon({

                    couponCode: req.body.code,
                    discount: req.body.discount,
                    valid_from: req.body.valid_from,
                    valid_to: req.body.valid_to,
                    status: 'Active',

                })
                await newCoupon.save()
                req.flash('success', 'coupon sccessfully added')
                res.redirect('/admin/adminCoupon')
            }

        } catch (error) {

            console.log(error);
            res.status(500).render("error500", { message: "Internal Server Error" })
        }
    },

    getBlockCoupon: async (req, res) => {
        try {
            const { id } = req.params
            console.log('this is my blocked id', id);
            const editCoupon = await Coupon.findOne({ _id: id })
            if (editCoupon.status==='Active') {
                await Coupon.findOneAndUpdate({ _id: id }, { status: 'Block' })
            } else if (editCoupon.status === 'Block') {
                await Coupon.findByIdAndUpdate({ _id: id }, { status: 'Active' })
            }
            req.flash('success', 'Coupon Status sccessfully Changed')
            res.redirect('/admin/adminCoupon')

        } catch (error) {
            console.log(error);
        }
    },

    getdeleteCoupon:async(req,res)=>{
        try {
            const {id}=req.params
            const newUser= await User.findOne({_id:id})
            if(newUser){
                req.flash("error","Coupon already in use, Cannot Delete.......")
                res.redirect('/admin/adminCoupon')
            }else{
                await Coupon.findByIdAndDelete({_id:id})
                req.flash('success', 'Coupon Status Sccessfully Deleted')
                res.redirect('/admin/adminCoupon')
    
            }
        } catch (error) {
            console.log(error);
            res.status(500).render("error500", { message: "Internal Server Error" })
        }
    },

    getEditCoupon:async(req,res)=>{
        try {
            const {id}=req.params
            const editCoupon =await Coupon.findOne({_id:id})
            res.render('./admin/admin-edit-coupon',{editCoupon})
        } catch (error) {
            console.log(error);
            res.status(500).render("error500", { message: "Internal Server Error" })
        }
    },

    postEditCoupon:async(req,res)=>{
        try {
            const {id}=req.params
            const dis=req.body.discount
            const checkCoupon=await Coupon.findOne({discount:dis})
            
            if(checkCoupon){
                req.flash('error','This Coupon Alredy Exists')
                res.redirect('/admin/adminCoupon')

            }else{
                const newCoupon=await Coupon.findByIdAndUpdate({_id:id},
                    {
                        couponCode: req.body.code,
                        discount: req.body.discount,
                        valid_from: req.body.valid_from,
                        valid_to: req.body.valid_to,
                    })
                req.flash('success', 'Coupon Sccessfully Edited')
                res.redirect('/admin/adminCoupon')
            }
        } catch (error) {
            console.log(error);
            res.status(500).render("error500", { message: "Internal Server Error" })
        }
    },

    postApplyCoupon:async(req,res)=>{
        try {
            const couponName=req.body.coupon

            if(couponName){
                const applyCoupon=await Coupon.findOne({couponCode:couponName})
                const disval=(applyCoupon.discount)/100
                const total=req.session.grantTotal
                const discountedamount = (total * disval)
                const finalamount = total - (total * disval)
                req.session.amounttopay = finalamount
                res.json({ success: true, discountedAmount: discountedamount, grandTotal: finalamount })
            }else{
                req.session.amounttopay=req.session.grandTotal
                res.json({ success: false })
            }
        } catch (error) {
            console.log(error);
            res.status(500).render("error500", { message: "Internal Server Error" })
        }
    }

}






