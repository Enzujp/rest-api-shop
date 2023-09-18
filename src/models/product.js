const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        
    },
    productImage: {
        type: String, // since it's accepting a url
        required: true
    }
});


module.exports = mongoose.model('Product', productSchema)