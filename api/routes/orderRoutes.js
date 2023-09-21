const express = require("express");
const mongoose = require("mongoose"); // to initialize id
const router = express.Router();
const multer = require("multer")

const Order = require("../../src/models/order");
const Product = require("../../src/models/product");
const order = require("../../src/models/order");

const checkAuth = require("../../middlewares/check-auth");

const orderControllers = require("../../controllers/orderControllers");

// incoming GET results for orders
router.get('/', checkAuth, orderControllers.all_orders_get);

router.post('/', checkAuth, orderControllers.create_order_post );
// for specific orders
router.get('/:orderId', checkAuth, orderControllers.find_specific_order_get);

router.delete('/:orderId', checkAuth, orderControllers.delete_order);

module.exports = router;