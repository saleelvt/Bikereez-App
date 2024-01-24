
const Product = require('../models/productSchema')
const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const moment = require('moment')


module.exports = {


  getProductPage: async (req, res) => {

    try {

      
      
      
      const page = parseInt(req.query.page) || 1; // Get the page number from query parameters
      const perPage = 5; // Number of items per page
      const skip = (page - 1) * perPage;
      const totalCount = await Product.countDocuments();
      const products = await Product.find()
        .populate('BrandName', 'Name') // Populate the BrandName field with Name property
        .populate('Category', 'Name')   // Populate the Category field with name property
        .lean().skip(skip).limit(perPage)
      res.render('admin/productpage', { products,
        currentPage: page,
        perPage,
        totalCount,
        totalPages: Math.ceil(totalCount / perPage),   })
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  getAddProduct: async (req, res) => {

    const Categories = await Category.find();
    const brands = await Brand.find();
    res.render('admin/addProduct', { Categories, brands, messages: req.flash() })
  },

  postAddProduct: async (req, res) => {
    try {
      const images = []
      const category = await Category.findOne({ Name: req.body.Category });
      const BrandName = await Brand.findOne({ Name: req.body.BrandName });

      for (let i = 1; i <= 3; i++) {
        const fieldName = `image${i}`;
        if (req.files[fieldName] && req.files[fieldName][0]) {
          images.push(req.files[fieldName][0].filename);
        }
      }
      let Status
      if (req.body.AvailableQuantity <= 0) {
        Status = "Out of Stock";
      } else {
        Status = "In Stock";
      }

      // ini datas validation cheyyanam
      const newProduct = new Product({
        ProductName: req.body.ProductName,
        Price: req.body.Price,
        Description: req.body.Description,
        BrandName: BrandName._id,
        AvailableQuantity: req.body.AvailableQuantity,
        Category: category._id,
        Status: Status,
        Display: "Active",
        Specification1: req.body.Specification1,
        DiscountAmount: req.body.DiscountAmount,
        UpdatedOn: moment(new Date()).format("llll"),
        images: images,
      });

      // Wait for the product to be saved
      await newProduct.save();

      // Redirect to the appropriate route after successfully adding the product
      req.flash("success", "Product is Added Successfully");
      res.rediret("/admin/product")


    } catch (error) {
      req.flash('error', `${error}`);
      res.redirect("/admin/addProduct");
    }
  },

  blockProduct: async (req, res) => {
    try {

      const _id = req.params._id;
      const productData = await Product.findOne({ _id: _id })
      if (productData.Display === "Active") {
        const product = await Product.findByIdAndUpdate(_id, {
          Display: "Block",
        });
        res.redirect('/admin/product')
      } else if (productData.Display === "Block") {
        const product = await Product.findByIdAndUpdate(_id, {
          Display: "Active"
        });
        res.redirect("/admin/product");
      }
    } catch (error) {
      const alertMessage = "Error alert here while Operation";
      req.session.alert = alertMessage;
      res.redirect("/admin/product");
    }
  },

  getEditProduct: async (req, res) => {

    const _id = req.params._id;
    const categories = await Category.find();
    const brands = await Brand.find();
    const product = await Product.findOne({ _id }).populate('Category BrandName')

    res.render('admin/editproduct', {
      product: product,
      categories,
      brands,
    })
  },

  postEditProduct: async (req, res) => {
    const _id = req.params._id;

    try {
      let images = []
      const existingProduct = await Product.findById({ _id });
      if (existingProduct) {
        images.push(...existingProduct.images)
      }

      for (let i = 0; i < 3; i++) {
        const fieldName = `image${i + 1}`;
        if (req.files[fieldName] && req.files[fieldName][0]) {
          images[i] = req.files[fieldName][0].filename;
        }
      }
      console.log("this is the body before upadate", req.body);
      const category = await Category.findOne({ Name: req.body.Category });
      const BrandName = await Brand.findOne({ Name: req.body.BrandName });

      req.body.Category = category._id;
      req.body.BrandName = BrandName._id;
      req.body.images = images;

      if (req.body.AvailableQuantity <= 0) {
        req.body.Status = "Out of Stock";
      }
      await Product.findByIdAndUpdate(_id, req.body);
      req.flash("success", "Product is Updated Successfully");
      res.redirect('/admin/product')

    } catch (error) {
      console.log(`An error happened ${error}`);
      res.redirect("/admin/editproduct");
    }
  },










  getviewProductDetails: async (req, res) => {
    const _id = req.params._id;

    const categories = await Category.find();
    const brands = await Brand.find();
    const product = await Product.findOne({ _id }).populate('Category BrandName')
    console.log(product);

    res.render("admin/viewproductdetails", {
      product,
      categories,
      brands,
    });

  }




















}