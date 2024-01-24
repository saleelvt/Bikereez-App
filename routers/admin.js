
const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const adminAuth = require('../middleware/adminAuth')
const brandController = require('../controllers/brandController')
const categoryController = require("../controllers/categoryController")
const productController = require("../controllers/productController")
const couponController = require('../controllers/couponController')
const offerController = require('../controllers/offerController')
const dashboardController = require('../controllers/dashboardController')
const upload = require('../middleware/upload')
const orderController = require('../controllers/orderController')






router.route('/')

    .get(adminAuth.adminExist, adminController.initial)

router.route('/adminLogin')
    .get(adminAuth.adminExist, adminController.getLogin)
    .post(adminController.postLogin)

router.route('/admin-dashboard')
    .get(adminAuth.adminTokenAuth, adminController.getDashboard)









// --------------------------manageusers----------------------------------

router.route('/userslist')
    .get(adminAuth.adminTokenAuth, adminController.getUsers)

router.route('/userlist/:_id')
    .get(adminAuth.adminTokenAuth, adminController.blockUser)







// --------------------------------Brand contorller----------------------------

router.route('/brandpage')
    .get(adminAuth.adminTokenAuth, brandController.getbrandpage)

router.route('/addBrand')
    .get(adminAuth.adminTokenAuth, brandController.getAddBrand)
    .post(brandController.postAddBrand)

router.route('/editbrand/:_id')
    .get(adminAuth.adminTokenAuth, brandController.getEditBrand)
    .post(brandController.postEditBrand)

router.route('/blockBrand/:id')
    .get(brandController.getBlockBrand)

router.route('/deleteBrand/:id')
    .get(adminAuth.adminTokenAuth, brandController.deleteBrand)










// ------------------------Categories------------------------------


router.route('/category')
    .get(adminAuth.adminTokenAuth, categoryController.getcategory)

router.route('/addcategory')
    .get(adminAuth.adminTokenAuth, categoryController.getAddcategory)
    .post(categoryController.postAddcategory)

router.route('/blockCategory/:id')
    .get(adminAuth.adminTokenAuth, categoryController.getBlockCategory)

router.route('/deleteCategory/:id')
    .get(adminAuth.adminTokenAuth, categoryController.deleteCategory)

router.route('/editCategory/:id')
    .get(adminAuth.adminTokenAuth, categoryController.editCategory)
    .post(adminAuth.adminTokenAuth, categoryController.postEditCategory)







// -------------------------producte management -------------------------------------

router.route('/product')
    .get(adminAuth.adminTokenAuth, productController.getProductPage)

router.route('/addProduct')
    .get(adminAuth.adminTokenAuth, productController.getAddProduct)
    .post(upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), productController.postAddProduct)

router.route('/viewproductdetails/:_id')
    .get(adminAuth.adminTokenAuth, productController.getviewProductDetails)

router.route("/product/:_id")
    .get(adminAuth.adminTokenAuth, productController.blockProduct)

router.route('/editproduct/:_id')
    .get(adminAuth.adminTokenAuth, productController.getEditProduct)
    .post(upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }]), productController.postEditProduct)



//           < -----------------------------------------------order rouete---------------------------------------------------------->

router.route('/admin-OrderList')
    .get(adminAuth.adminTokenAuth, adminController.getOrderList)


router.route('/adminOrderDetailVeiw/:id')
    .get(adminAuth.adminTokenAuth, orderController.getOrderDetailView)
    .post(adminAuth.adminTokenAuth, orderController.postOrderDetailView)

router.route("/returnPending")
    .get(adminAuth.adminTokenAuth, orderController.getReturnPending)
//            <--------------------------------------------coupon managment ------------------------------------------------------->


router.route('/adminCoupon')
    .get(adminAuth.adminTokenAuth, couponController.getAdmincCoupon)

router.route('/addCoupon')
    .get(adminAuth.adminTokenAuth, couponController.getAddCoupon)
    .post(adminAuth.adminTokenAuth, couponController.postAddCoupon)

router.route('/blockCoupon/:id')
    .get(adminAuth.adminTokenAuth, couponController.getBlockCoupon)

router.route('/editCoupon/:id')
    .get(adminAuth.adminTokenAuth, couponController.getEditCoupon)
    .post(adminAuth.adminTokenAuth, couponController.postEditCoupon)

router.route('/deleteCoupon/:id')
    .get(adminAuth.adminTokenAuth, couponController.getdeleteCoupon)

//----------------------------------------------------Offer router-----------------------------------------------------

router.route('/offers')
    .get(adminAuth.adminTokenAuth, offerController.getAdminOffers)

router.route('/addOffers')
    .get(adminAuth.adminTokenAuth, offerController.getAddOffers)
    .post(adminAuth.adminTokenAuth, offerController.postAddOffers)

router.route('/blockoffer/:id')
    .get(adminAuth.adminTokenAuth, offerController.getBlockOffer)

router.route('/deleteoffer/:id')
    .get(adminAuth.adminTokenAuth, offerController.getDeleteOffer)

router.route('/editoffer/:id')
    .get(adminAuth.adminTokenAuth, offerController.getEditOffer)
    .post(adminAuth.adminTokenAuth, offerController.postEditOffer)


//-------------dashboard-------------

router.route('/latestOrders')
    .get(adminAuth.adminTokenAuth, dashboardController.getLatestOrders)

router.route('/countByday')
    .get(dashboardController.getCount)

router.route('/countBymonth')
    .get(dashboardController.getCount)

router.route("/countByyear")
    .get(dashboardController.getCount)

router.route('/salesReportDownload')
.post(dashboardController.getSalesReportDownload)    


//                            ----------------------logout-------------------------------------


router.route('/adminlogout')
    .get(adminController.getAdminLogout)


module.exports = router