const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../../src/models/product");


router.get('/', (req, res, next) => {
    Product.find()// to display all products
    .select("_id name price") // specify items to be displayed
    .exec() // exec doesnt work when .save() is called
    .then(docs => {
        // return a response displaying required properties
        const objectResponse = {
            count: docs.length,
            products: docs.map(doc => { // return product details in a list
               return {
                name: doc.name,
                price: doc.price,
                id: doc._id,
                request: {
                    requestType: 'GET',
                    url: "http://localhost:7000/" + doc.id
                }
               }
            })
        };
        res.status(200);
        res.json({
            objectResponse
        });
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
    product.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
        message : "Created Product",
        createdProduct : {
            name: result.name,
            price: result.price,
            id : result._id,    
            request: {
                requestType: 'POST',
                url: "http://localhost:7000/" + result.id
            }
        }
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
    Product.findById(id)
    .select("_id name price")
    .exec()
    .then( doc=> {
        console.log("fetched from database", doc);
        if (doc){
            const objectResponse = {
                name: doc.name,
                price: doc.price,
                id: doc._id,
                request: {
                    requestType: 'GET',
                    url: "http://localhost:7000/products/" + id
                }
            }
            res.status(200).json(objectResponse); // return status code and document json property
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
    Product.updateOne({_id: id }, {$set: updatePars})
    .select("_id name price")
    .exec()
    .then(result => {
        const objectResponse = {
            name: result.name,
            price: result.price,
            id: result._id,
            request: {
                requestType: "PATCH",
                url: "http://localhost:7000/products/" + id
            }
        }
        res.status(200).json(objectResponse)

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
        res.status(200).json({
            message: "This item has been deleted",
            // show user where they can go to create a new product
            // but is that really wise? we'll see
            request: {
                requestType: "POST",
                url: "http://localhost:7000/products/",
                body: {
                    name: 'String',
                    price: 'Number'
                }
            }
        })
     })
     .catch(err => {
        console.log(err)
        res.status(500).json({
            error : err
        })
     });
})




module.exports = router;