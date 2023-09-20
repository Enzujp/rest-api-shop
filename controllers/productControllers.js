const Product = require("../src/models/product");
const mongoose = require("mongoose");
const multer = require("multer");

const storage = multer.diskStorage({ // takes two arguments
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + new Date().toISOString() );
    }
})


const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(fileError({
            message: "Only takes in images in jpg and png formats"
        }), false)
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter }); //initialize multer and choose storage file

// Display all available products
module.exports.all_products_get = (req, res) => {
    Product.find()// to display all products
    .select("_id name price productImage") // specify items to be displayed
    .exec() 
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
                    url: "http://localhost:7000/products/" + doc.id
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
}

// Create a new Product
module.exports.create_product_post = (req, res) => {
    // req.file available due to multer
    const product = new Product({
        _id: new mongoose.Types.ObjectId(), // create new unique id
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
        message : "Created Product",
        createdProduct : {
            name: result.name,
            price: result.price,
            productImage: result.productImage,
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
    
}

// Find Product by Id
module.exports.find_product_by_id_get = (req, res) => {
    const id = req.params.productId;
    Product.findById(id)
    .select("_id name price productImage")
    .exec()
    .then( doc=> {
        console.log("fetched from database", doc);
        if (doc){
            const objectResponse = {
                name: doc.name,
                price: doc.price,
                productImage: doc.productImage,
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
}

// Patch product by Id
module.exports.product_patch = (req, res) => {
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
}

// Delete Product
module.exports.product_delete = (req, res) => {
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
}