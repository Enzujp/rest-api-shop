const express = require("express");
const mongoose = require("mongoose"); // to initialize id
const router = express.Router();
const multer = require("multer")

const Order = require("../../src/models/order");
const Product = require("../../src/models/product");
const order = require("../../src/models/order");

// incoming GET results for orders
router.get('/', (req, res) => {
    Order.find()
    .select("quantity product _id productImage")
    .populate('product') // get more details than just an _id. accepts a second argument for specificity
    .exec()
    .then(docs => {
       res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
            return{
                quantity: doc.quantity,
                _id: doc._id,
                productId: doc.product
            }
        }),
        requestType: 'GET',
        url: "http://localhost:7000/orders" 
       })
    })
})


router.post('/', (req, res) => {
    Product.findById(req.body.productId) // check to ensure product is available
        .then(product =>  {
            if (!product) {
                return res.status(404).json({
                    message: "This Product wasn't found"
                });
            } 
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            })
            order.save()
            .then(result => {
                res.status(201).json({
                    message: "Your order has been successfully placed",
                    orderDetails: {
                        orderId: result._id,
                        orderedProduct: result.product,
                        orderName: result.name,
                        orderQuantity: result.quantity,
                        // orderPrice: result.price, // check to confirm that the price attr is included
                        request: {
                            requestType: 'POST',
                            url: "http://localhost:7000/" + result._id
                        }
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                message: "Product not found "
            })
        })
        
    })


// for specific orders
router.get('/:orderId', (req, res) => {
    // find order with specific orderId
    Order.findById(req.params.orderId)
    .select("_id product quantity")
    .populate('product')
    .exec()
    .then(order => {
        res.status(201).json({
            orderDetails: {
                orderId: order._id,
                productOrdered: order.product,
                orderQuantity: order.quantity,
                request: {
                    requestType: 'GET',
                    url: "http://localhost:7000/orders/" 
                }
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err,
            message: "Internal Server Error"
        })
    })
})

router.delete('/:orderId', (req, res) => {
    Order.remove({ _id: req.params.orderId })
    .exec()
    .then(order => {
        if (!order) {
            res.status(400).json({
                message: "Page not found"
            })
        }
        res.status(200).json({
            message: "This Order has been deleted",
            request: {
                requestType: 'POST',
                url: "http://localhost:7000/orders",
                body: {
                    "productId": "ID",
                    "quantity": "Number"
                }
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router;