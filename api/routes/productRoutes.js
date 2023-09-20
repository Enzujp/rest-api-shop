const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../../middlewares/check-auth");
const productControllers = require("../../controllers/productControllers");






// Display all Products
router.get('/', productControllers.all_products_get); 

// create a product
// ensure user is verified with token
router.post('/', checkAuth, upload.single('productImage'), productControllers.create_product_post)

router.get('/:productId', productControllers.find_product_by_id_get);

router.patch('/:productId', productControllers.product_patch);

router.delete('/:productId', productControllers.product_delete);



module.exports = router;