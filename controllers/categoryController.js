const Brand = require('../models/brandSchema');
const Admin = require('../models/adminSchema');
const Category = require('../models/categorySchema');
const Products = require('../models/productSchema');
const Wallet=require('../models/walletSchema')
const flash=require("express-flash")

module.exports = {

    getcategory: async (req, res) => {

        const page = parseInt(req.query.page) || 1; // Get the page number from query parameters
        const perPage = 5; // Number of items per page
        const skip = (page - 1) * perPage;
        const cat = await Category.find({}).sort({ Name: 1 }).skip(skip).limit(perPage);
        const totalCount = await Category.countDocuments();
        res.render('admin/categorypage', {
            cat,
            currentPage: page,
            perPage,
            totalCount,
            totalPages: Math.ceil(totalCount / perPage),
        })
    },
    getAddcategory: (req, res) => {

        res.render('./admin/addCategory')
    },

    postAddcategory: async (req, res) => {
        try {
            const brandname = req.body.Name
            console.log(brandname);
            const category = await Category.findOne({ Name: brandname })
            if (category) {
                console.log('category alredy exist');
                req.flash("error", "category already Exits");
                res.redirect('/admin/addCategory')
            } else {
                await Category.create(req.body);
                res.redirect('/admin/category')
            }
        } catch (error) {
            console.log(error);
            req.flash('error', 'Error adding the category')
            res.redirect("/admin/category");

        }
    },

    getBlockCategory:async(req,res)=>{
         
        try {
           
            const {id}= req.params
         
          const   ChangedStatus=await Category.findOne({_id:id})

         if(ChangedStatus.status==='Active'){
            let a =await Category.findByIdAndUpdate({_id:id},{status:'Block'})
      
          let b=  await Products.updateMany({Category: id}, {Display: "Block"});

     
            
            
        }else if(ChangedStatus.status==='Block'){
            await Category.findByIdAndUpdate({_id:id},{status:'Active'})
            await Products.updateMany({Category: id}, {Display: "Active"});
         }
         req.flash('success','Category Status is Successfully Changed')
         res.redirect('/admin/category')
        } catch (error) {
            console.log(error);
        }
    },

     deleteCategory: async(req,res)=>{
      
        const {id} = req.params
         console.log(id)   
         
         const user= await Products.findOne({Category:id})
         if(user){
            req.flash('error','Category in use ,Cannot Delete....')
            console.log('category in use cannot Delete');   
            res.redirect('/admin/category')
         }else{
            const deleteCategory=await Category.findOneAndDelete({_id:id})
            req.flash('success','Category is Successfuly  Deleted....')
            res.redirect('/admin/category')
     }
               
         
     },

     editCategory:async(req,res)=>{

        try {
            const {id}=req.params
            console.log(id);
            const editCategory=await Category.findById({_id:id})
            res.render('./admin/editCategory',{editCategory})
        } catch (error) {
            console.log(error);
        }

   
     },
     postEditCategory:async(req,res)=>{
      
         const{id}=req.params
         console.log(req.body,'iam herte');
         const name=req.body.Name
         console.log(id,'and',name);
         const Categories=await Category.findOne({Name:name})
         if(Categories){  
               
            req.flash('error','Category all redy exiested')
            res.redirect('/admin/category')
         }else{
            const editedCat=await Category.findByIdAndUpdate({_id:id},{Name:name})
            req.flash('success','Category Successfuly Edited')
            res.redirect('/admin/category')
         }
     }




































    // getEditCategory: async (req, res) => {

    //     const  _id  = req.params._id
    //     const category = await Category.findById({ _id: _id })
    //     res.render("admin/editCategory", { category })

    // },
    // postEditcategory: async (req, res) => {
        
    //     const id = req.params._id
    //     try {
    //         const id = req.params._id

    //         const { name } = req.body; /// Assuming Name is a property in the request body.

    //         let category = await Category.findByIdAndUpdate({ _id: id }, { $set: req.body })
          
    //         res.redirect("/admin/category")
            

    //     } catch (error) {
    //         console.error("Error updating brand name:", error);

    //     }

    // },
    // deleteCategory: async (req,res)=>{
    //     try{
    //         const id=req.params.id;
    //         await Category.findByIdAndRemove(id)
    //         res.redirect('/admin/category')
    //     }catch(error){
    //         console.log('error removing user :',error);
           
    //     }
    // }

}

