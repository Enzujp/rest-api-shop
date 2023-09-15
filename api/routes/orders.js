const express = require("express");
const mongoose = require("mongoose"); // to initialize id
const router = express.Router();

const Order = require("../../src/models/order");


// incoming GET results for orders
router.get('/', (req, res, next) => {
    Order.find()
    .select("quantity product _id")
    .exec()
    .then(docs => {
        const objectResponse = {
            count: docs.count,
            orders: docs.map(doc=> {
                return{
                    orderQuantity: doc.quantity,
                    product: doc.product, // check this line
                    orderId: doc._id,
                    request: {
                        requestType: 'GET',
                        url: "http://localhost:7000/orders"
                    }
                };
                
        
            })
        };
        res.status(200).json({objectResponse});
    })
})


router.post('/', (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
    });
    order.save()
    .then(result => {
        res.status(201).json({
            message: "Your order has been successfully placed",
            orderDetails: {
                orderId: result._id,
                orderName: result.name,
                orderQuantity: result.quantity,
                request: {
                    requestType: 'POST',
                    url: "http://localhost:7000/" + result._id
                }
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            errorMessage: err,
            errorText: "find me please"
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