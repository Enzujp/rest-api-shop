const express = require("express");

const router = express.Router();

// incoming GET results for orders
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Here are your orders"
    })
})


router.post('/', (req, res, next) => {
    res.status(201).json({
        message: "Your orders have been received!"
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