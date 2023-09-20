const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1]; // put the token in your postman header
        const decoded = jwt.verify(token, 'this is my secret key');
        req.userData = decoded;
        next();
    }
     catch(error) {
        return res.status(401).json({
            message: "Auth Failed"
        })
     } 
};