const Brand = require('../models/brandSchema');
const Admin = require('../models/adminSchema');
const Product=require('../models/productSchema')
const flash=require("express-flash")

module.exports = {

    getbrandpage: async (req, res) => {
        const page = parseInt(req.query.page) || 1; // Get the page number from query parameters
        const perPage = 5; // Number of items per page
        const skip = (page - 1) * perPage;
        const brands = await Brand.find({}).sort({ Name: 1 }).skip(skip).limit(perPage);
        const totalCount = await Brand.countDocuments();
    
        res.render('admin/brandpage', { brands,  
             currentPage: page,
            perPage,
            totalCount,
            totalPages: Math.ceil(totalCount / perPage), 
        })
    },
    getAddBrand: (req, res) => {
        const adminName = req.session.admin.Name;
        res.render('admin/addBrand', { adminName })
    },

    postAddBrand: async (req, res) => {
        try {
            const brandname = req.body.Name
            console.log(brandname);
            const brandtest = !/^\s+$/
            const brand = await Brand.findOne({ Name: brandname })
            if (brand) {
                console.log('brand alredy exist');
                req.flash("error", "Brand already Exits");
                res.redirect('/admin/addBrand')
            } else {
                const brands = await Brand.create(req.body);
                res.redirect('/admin/brandpage')
            }
        } catch (error) {
            console.log(error);
            req.flash('error', 'Error adding the Brand')
            res.redirect("/admin/brandpage");

        }
    },
    getEditBrand: async (req, res) => {
        const adminName = req.session.admin.Name;
        const _id = req.params._id;
        const brand = await Brand.findById(_id);
        res.render('admin/editbrand', { brand, adminName })

    },
    postEditBrand: async (req, res) => {
        const _id = req.params._id;
        const { Name } = req.body; /// Assuming Name is a property in the request body.
        try {
            // Use exec() to return a promise from Mongoose
            const updatedName = await Brand.findByIdAndUpdate({ _id: _id }, { Name: Name }).exec();
            console.log('updated brand name id:', updatedName);
            // after that nammal page redirect cheyyunnu URL
            res.redirect("/admin/brandpage")

        } catch (error) {
            console.error("Error updating brand name:", error);

        }

    },

    getBlockBrand:async(req,res)=>{
      try {
        const {id}=req.params
        const editedbrand=await Brand.findOne({_id:id})

        if(editedbrand.status==='Active'){
            await Brand.findByIdAndUpdate({_id:id},{status:'Block'})
            await Product.updateMany({BrandName:id},{Display:'Block'})
        }else if(editedbrand.status==='Block'){
            await Brand.findByIdAndUpdate({_id:id},{status:'Active'})
            await Product.updateMany({BrandName:id},{status:'Active'})
        }

        req.flash("success", "Brand Status Successfully Changed");
        res.redirect('/admin/brandpage')
      } catch (error) {
        console.log(error);
      }
    },

    deleteBrand: async (req, res) => {
        try {
            const {id} = req.params
            const user=await Product.findOne({BrandName:id})
         
            if(user){
                req.flash('error','Brand in using now , Cannot Delete... ')
                res.redirect('/admin/brandpage')
            }else{
                await Brand.findOneAndDelete({_id:id});
                console.log();
             res.redirect('/admin/brandpage');
            }
           
        } catch (error) {
            console.log('error in side ');
            console.error("Error removing user:", error);
            res.status(500).json({ message: "An error occurred while removing user" });
        }
    }



}

