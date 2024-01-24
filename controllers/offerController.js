
const Offer = require('../models/offerSchema')
const flash = require('express-flash')
const Product = require('../models/productSchema')
const User = require('../models/userSchema')
const Cart = require('../models/cartSchema')
const Category = require('../models/categorySchema')

module.exports = {

    getAdminOffers: async (req, res) => {
        try {

            
            
            const page = parseInt(req.query.page) || 1; // Get the page number from query parameters
            const perPage = 5; // Number of items per page
            const skip = (page - 1) * perPage;
            const totalCount = await Offer.countDocuments();
            const sendoffer = await Offer.find({}).sort({ CategoryName: 1 }).skip(skip).limit(perPage);
            res.render('./admin/admin-category-offer', { sendoffer,
                currentPage: page,
                perPage,
                totalCount,
                totalPages: Math.ceil(totalCount / perPage), })
        } catch (error) {
            console.log(error)
            res.status(500).render("error500", { message: "Internal Server Error" })
        }
    },
    getAddOffers: async (req, res) => {
        try {
            const sendCategory = await Category.find({}).sort({ Name: 1 })
            res.render('./admin/add-category-offer', { sendCategory })
        } catch (error) {
            console.log(error);
            res.status(500).render("error500", { message: "Internal Server Error" })
        }
    },

    postAddOffers: async (req, res) => {
        try {
            const Name = req.body.name
            const testCategory = await Offer.findOne({ CategoryName: Name })
            if (testCategory) {
                req.flash("error", "Offer already exists for this category....")
                res.redirect('/admin/addOffers')

            } else {
                const newOffer = new Offer({
                    CategoryName: req.body.name,
                    Discount: req.body.discount,
                    Valid_from: req.body.valid_from,
                    Valid_to: req.body.valid_to,
                    Status: 'Active'

                })

                await newOffer.save()
                const newcategory = await Category.findOne({ Name: Name })
                const categoryId = newcategory._id
                const updateProduct = await Product.find({ Category: categoryId })
                const newdiscount = (req.body.discount) / 100
                for (x of updateProduct) {

                    const dbofferPrice = x.OfferPrice
                    x.OfferPrice = (x.DiscountAmount) * newdiscount
                    const updateOffer =x.DiscountAmount-x.OfferPrice
                    const UpadateOfferPrice = await Product.findByIdAndUpdate(x._id,
                        { $set: { OfferPrice: updateOffer, OfferDiscount: req.body.discount } },
                        { new: true })
                }
                res.redirect('/admin/offers')



            }

        } catch (error) {
            console.log(error);
            res.status(500).render("error500", { message: "Internal Server Error" })  
        }
    },

    getBlockOffer:async(req,res)=>{
        try {
            
            const {id}=req.params
            const updateOffer=await Offer.findByIdAndUpdate({_id:id})
            if(updateOffer.Status==='Active'){
                const newOffer=await Offer.findByIdAndUpdate({_id:id},{Status:'Block'})
                const categories=await Category.findOne({Name:newOffer.CategoryName})
                const updateProduct=await Product.find({Category:categories._id}).populate('Category')
                for(x of updateProduct){
                    await Product.findByIdAndUpdate(x._id,{$set:{OfferPrice:0,OfferDiscount:0}})
                }
            
            }else{
                const newoffer=await Offer.findByIdAndUpdate({_id:id},{Status:"Active"})
                const categories=await Category.findOne({Name:newoffer.CategoryName})
                const updateProduct=await Product.find({Category:categories._id}).populate('Category')
                let OfferPrice=0
                let OfferDiscount=newoffer.Discount
                const newdiscount=(newoffer.Discount)/100
                for(x of updateProduct){
                    OfferPrice= (x.DiscountAmount) * newdiscount
                    await Product.findByIdAndUpdate(x._id,{$set:{OfferPrice:OfferPrice,OfferDiscount:OfferDiscount}})
                }
            }

            res.redirect('/admin/offers')
        } catch (error) {
            console.log(error);
            res.status(500).render("error500", { message: "Internal Server Error" })
        }
    },

    getDeleteOffer:async(req,res)=>{
        try {
            const {id}=req.params
          const offers=await Offer.findOne({_id:id})
          const categoryName=offers.CategoryName
          const newcategory=await Category.find({Name:categoryName})
          const newId=newcategory._id
          const editProduct= await Product.find({Category:newId})

          for(x of editProduct){
            await Product.findByIdAndUpdate(x._id,{$set:{OfferPrice:0,OfferDiscount:0}},{
                new:true
            })
          }
          await Offer.findByIdAndDelete({_id:id})
          req.flash('success','Offer Deleted')
          res.redirect('/admin/offers')
        } catch (error) {
            console.log(error);
            res.status(500).render("error500", { message: "Internal Server Error" }) 
        }
    },

    getEditOffer:async(req,res)=>{
        try {
            const {id}=req.params
            const sendCategory=await Category.find({})
            const editOffer=await Offer.findOne({_id:id})
            res.render('./admin/edit-offer',{editOffer,sendCategory})
            

        } catch (error) {
            console.log(error);
            res.status(500).render("error500", { message: "Internal Server Error" }) 
        }
    },

    postEditOffer:async(req,res)=>{
        try {
            const {id}=req.params
            const name=req.body.name
            const checkOffer=await Offer.findOne({CategoryName:name})
            if(checkOffer){
                console.log('saleel');
                req.flash('error','Offer Alredy Exists...')
                res.redirect('/admin/offers')
            }else{
               
                await Offer.findByIdAndUpdate({_id:id},
                       {CategoryName:req.body.name,
                        Discount: req.body.discount,
                        Valid_from: req.body.valid_from,
                        Valid_to: req.body.valid_to,
                    }
                    )
                req.flash('success','Offer Successfully Added...')
                res.redirect('/admin/offers')
            }

        } catch (error) {
            console.log(error);
            res.status(500).render("error500", { message: "Internal Server Error" }) 
        }
    }

















}
