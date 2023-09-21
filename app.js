const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");   

const productRoutes = require("./api/routes/productRoutes");
const orderRoutes = require("./api/routes/orderRoutes");
const userRoutes = require("./api/routes/userRoutes");

const app = express();

const bodyParser = require("body-parser");


// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json({ "limit": "10mb" }));
app.use('/uploads', express.static('uploads')); //make available
app.use(morgan('dev'));


// request handling routes
app.use('/products', productRoutes); 
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);


// database connection
const dbURI = "mongodb+srv://gem:jesse@cluster0.f3cqsmn.mongodb.net/";
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true });



// error handler
app.use((req, res, next) => {
    const error = Error('Not found'); // error object is available and requires no imports
    error.status = 404;
    next(error); // using next to forward updated errors
})


// handle all errors, including database errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message: error.message
        }
    })
})



// listen for server
app.listen(7000, ()=> console.log("This works"));


// app.get('/', (req, res)=> {
//     res.status(200).json({
//         message: "This works boo thang"
//     });
// })