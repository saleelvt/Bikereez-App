
const Product = require("../models/productSchema")
const Brand = require("../models/brandSchema")
const Category = require("../models/categorySchema")
const Cart = require("../models/cartSchema")
const User = require("../models/userSchema")
const order = require("../models/orderSchema")
const Wallet = require("../models/walletSchema")
const flash = require("express-flash")
const { generateSalesPDF } = require("../utility/downloadSalesReport")

module.exports = {






    getLatestOrders: async (req, res) => {
        try {
            const latestOrders = await order.find().sort({ _id: -1 }).limit(6);

            const bestSeller = await order.aggregate([
                { $unwind: '$items' },
                { $group: { _id: '$items.productId', totalCount: { $sum: '$items.quantity' } } },
                { $sort: { totalCount: -1 } },
                { $limit: 6 },

                { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "productDetails" } },
                
                { $unwind: "$productDetails" }
            ])
           

            // console.log('product details ',productDetails );

            if (!latestOrders || !bestSeller) throw new Error("No Data Found");

            console.log('best seller',bestSeller);

            res.json({ latestOrders, bestSeller });
        } catch (error) {
            console.error("Error while fetching the order details in the dashboard", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },



    getCount: async (req, res) => {
        try {
            const orders = await order.find({
                status: { $nin: ["Returned", "Cancelled", "Rejected"] }
            })


            const orderCountsByDay = {};
            const totalAmountByDay = {};

            const orderCountsByMonthYear = {};
            const totalAmountByMonthYear = {};

            const orderCountsByYear = {};
            const totalAmountByYear = {};

            let labelsByCount;
            let labelsByAmount;

            orders.forEach((order) => {

                const orderDate = new Date(order.orderDate)
                const dayMonthYear = orderDate.toISOString().split('T')[0]
                const monthYear = orderDate.toISOString().slice(0, 7);
                const year = orderDate.getFullYear().toString();


                if (req.url === "/countByday") {
                    if (!orderCountsByDay[dayMonthYear]) {
                        orderCountsByDay[dayMonthYear] = 1;
                        totalAmountByDay[dayMonthYear] = order.totalAmount;
                    } else {
                        orderCountsByDay[dayMonthYear]++;
                        totalAmountByDay[dayMonthYear] += order.totalAmount;
                    }
                    const ordersByDay = Object.keys(orderCountsByDay).map(
                        (dayMonthYear) => ({
                            _id: dayMonthYear,
                            count: orderCountsByDay[dayMonthYear],
                        })
                    );
                    const amountsByDay = Object.keys(totalAmountByDay).map(
                        (dayMonthYear) => ({
                            _id: dayMonthYear,
                            total: totalAmountByDay[dayMonthYear],
                        })
                    );
                    amountsByDay.sort((a, b) => (a._id < b._id ? -1 : 1));
                    ordersByDay.sort((a, b) => (a._id < b._id ? -1 : 1));

                    labelsByCount = ordersByDay.map((entry) =>
                        new Date(entry._id).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })
                        );

                    labelsByAmount = amountsByDay.map((entry) =>
                    new Date(entry._id).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })
                );
                dataByCount = ordersByDay.map((entry) => entry.count);
                dataByAmount = amountsByDay.map((entry) => entry.total);


                }else if(req.url === "/countBymonth"){

                    if (!orderCountsByMonthYear[monthYear]) {
                        orderCountsByMonthYear[monthYear] = 1;
                        totalAmountByMonthYear[monthYear] = order.totalAmount;
                    } else {
                        orderCountsByMonthYear[monthYear]++;
                        totalAmountByMonthYear[monthYear] += order.totalAmount;
                    }

                    const ordersByMonth = Object.keys(orderCountsByMonthYear).map(
                        (monthYear) => ({
                            _id: monthYear,
                            count: orderCountsByMonthYear[monthYear],
                        })
                    );
                    const amountsByMonth = Object.keys(totalAmountByMonthYear).map(
                        (monthYear) => ({
                            _id: monthYear,
                            total: totalAmountByMonthYear[monthYear],
                        })
                    );
                    ordersByMonth.sort((a, b) => (a._id < b._id ? -1 : 1));
                    amountsByMonth.sort((a, b) => (a._id < b._id ? -1 : 1));


                    labelsByCount = ordersByMonth.map((entry) =>
                    new Date(entry._id).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                    })
                );

                labelsByAmount = amountsByMonth.map((entry) =>
                    new Date(entry._id).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                    })
                );


                dataByCount = ordersByMonth.map((entry) => entry.count);
                dataByAmount = amountsByMonth.map((entry) => entry.total);


                }else if(req.url === "/countByyear"){

                    if (!orderCountsByYear[year]) {
                        orderCountsByYear[year] = 1;
                        totalAmountByYear[year] = order.totalAmount;
                    } else {
                        orderCountsByYear[year]++;
                        totalAmountByYear[year] += order.totalAmount;
                    }

                    const ordersByYear = Object.keys(orderCountsByYear).map((year) => ({
                        _id: year,
                        count: orderCountsByYear[year],
                    }));
                    const amountsByYear = Object.keys(totalAmountByYear).map((year) => ({
                        _id: year,
                        total: totalAmountByYear[year],
                    }));

                    ordersByYear.sort((a, b) => (a._id < b._id ? -1 : 1));
                    amountsByYear.sort((a, b) => (a._id < b._id ? -1 : 1));

                    labelsByCount = ordersByYear.map((entry) => entry._id.toString());
                    labelsByAmount = amountsByYear.map((entry) => entry._id.toString());
                    dataByCount = ordersByYear.map((entry) => entry.count);
                    dataByAmount = amountsByYear.map((entry) => entry.total);

                }

            })

            res.json({ labelsByCount, labelsByAmount, dataByCount, dataByAmount });




        } catch (error) {
            console.error("error while chart loading :", error);
        }
    },

    getSalesReportDownload:async(req,res)=>{
        try {
      
            let startDate = new Date(req.body.startDate);
            let endDate = new Date(req.body.endDate);

            endDate.setHours(23, 59, 59, 999);
            startDate.setHours(0, 0, 0, 0) 

            const Order= await order.find({
                paymentStatus:'paid',
                orderDate:{$gte:startDate,$lte:endDate}
            }).populate("items.productId")

            const pdfBuffer = await generateSalesPDF(Order, startDate, endDate);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=sales Report.pdf"
            );
            res.status(200).end(pdfBuffer);
          

        } catch (error) {
            console.log(error);
            res.status(500).render("error500", { message: "Internal Server Error" })
        }
    }

















}





