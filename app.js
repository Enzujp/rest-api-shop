const express = require("express");

const app = express();

const bodyParser = require("body-parser");


// Middleware
app.use(express.json());
// app.use((bodyParser.urlencoded({ extend: true })));

app.listen(7000, ()=> console.log("This works"));


app.get('/', (req, res)=> {
    res.send("Yeah, this is the homepage");
})