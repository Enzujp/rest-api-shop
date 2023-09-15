const express = require("express");
const mongoose = require("mongoose"); // to initialize id
const router = express.Router();

const Order = require("../../src/models/order");
const Product = require("../../src/models/product");

// incoming GET results for orders
router.get('/', (req, res, next) => {
    Order.find()
    .select("quantity product _id")
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
router.get('/:orderId', (req, res, next) => {
    const order = req.params.orderId;
    res.status(200).json({
        message: "Here is your order",
        order: order
    })
})

router.delete('/:orderId', (req, res, next) => {
    const order = req.params.orderId;
    res.status(200).json({
        message: "This order has been deleted",
        order: order
    })
})

module.exports = router;