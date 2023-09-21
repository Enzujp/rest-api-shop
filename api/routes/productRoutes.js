const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkAuth = require("../../middlewares/check-auth");
const productControllers = require("../../controllers/productControllers");
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




// Display all Products
router.get('/', productControllers.all_products_get); 

// create a product
// ensure user is verified with token
router.post('/', checkAuth, upload.single('productImage'), productControllers.create_product_post);

router.get('/:productId', productControllers.find_product_by_id_get);

router.patch('/:productId', productControllers.product_patch);

router.delete('/:productId', productControllers.product_delete);



module.exports = router;