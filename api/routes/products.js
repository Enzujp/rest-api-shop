const express = require("express");
const router = express.Router();


router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Sending GET requests to /products"
    })
})

router.post('/', (req, res, next) => {
    // create a product
    const product = {
        name : req.body.name, // should be passed in the frontend, would be stated in documentation
        price : req.body.price
    }
    

    res.status(201).json({
        message : "Sending POST requests to /products",
        createdProduct : product
    })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({message: "Great job discovering the special deal", id : id});
    }
    else {
        res.status(200).json({
            message: "This is the product you are looking for my friend."
        })
    }
})

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: "This product has been updated"
    })
})

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: "This product has been deleted"
    })
})




module.exports = router;