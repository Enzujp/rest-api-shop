const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");


const User = require("../../src/models/User");


// routes
router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user) {
            res.status(409).json({
                message: "User with this mail already exists"
            })
        }
    })
    bcrypt.hash(req.body.password, 10, (err, hash) => {// 10 salting rounds is considered safe
        if (err) {
            return res.status(500).json({
                error: err
            });
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
                })
                user.save()
                .then(result => {
                    console.log(result)
                    res.status(201).json({
                        message: "User successfully created"
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        }
    
    })

})


module.exports = router;