const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { // create a link with product model
        type: mongoose.Schema.Types.ObjectId,
         ref:'Product',
         required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
})


module.exports = mongoose.model("Order", orderSchema);