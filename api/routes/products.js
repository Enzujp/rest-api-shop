const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../../src/models/product");


router.get('/', (req, res, next) => {
    Product.find() // to display all products
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200);
        res.json({
            docs
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500);
        res.json({
            error: err
        })
    })
})

router.post('/', (req, res, next) => {
    // create a product
    const product = new Product({
        _id: new mongoose.Types.ObjectId(), // create new unique id
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
        message : "Sending POST requests to /products",
        createdProduct : product
    })
    })
    .catch(err => {
        console.log(err);
        res.status(500)
        res.json({
            error: err
        })
    });
    
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).exec()
    .then( doc=> {
        console.log("fetched from database", doc);
        if (doc){
            res.status(200).json(doc); // return status code and document json property
        } else {
            res.status(404).json({
                message: "Cannot find details associated with this product ID"
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500);
        res.json({
            error: err
        })
    })
})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updatePars = {}; // set empty object to hold updates to be made
    for (const pars of req.body) { // parameters are json objects, tap into key and value ppties
        updatePars[pars.itemName] = pars.value
    }
    Product.updateOne({_id: id }, {$set: updatePars}).exec()
    .then(result => {
        console.log(result);
        res.status(200);
        res.json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500);
        res.json({errorMessage: err})
    })
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ 
        _id: id // remove _id property from database with value of id
     }).exec()
     .then(result => {
        res.status(200).json(result)
     })
     .catch(err => {
        console.log(err)
        res.status(500).json({
            error : err
        })
     });
})




module.exports = router;