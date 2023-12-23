const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // recall to install this


const User = require("../../src/models/User");
const checkAuth = require("../../middlewares/check-auth");


// routes
router.post('/signup', (req, res, next) => {
    // const { email, password } = req.body
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1) { // since the db returns an empty array instead of null
            res.status(409).json({
                message: "User with this mail already exists"
            })
        } else {
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
        
        }
    })
    
})


router.get('/login', (req, res, next) => {
    User.find({email: req.body.email}).exec() // returns an array instead of findOne
    .then(user => {
        if (user.length <= 1) { // if a user exists with said email
            return res.status(401).json({
                message: 'User with this email doesnt exist'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: "Authentication Failed"
                });
            }
            if (result) {
                const token = jwt.sign({ 
                    email: user[0].email,
                    userId: user[0]._id
                }, 'this is my secret key', 
                {
                    expiresIn: "1h"
                })
                return res.status(200).json({
                    message: "Authentication Successful",
                    token: token
                });
            }
            res.status(401).json({
                message: "Authentication Failed"
            })
        })
        }
    )
    .catch(err => {
        res.status(500).json({
            err: err
        })
    })
})


// for Admin
router.delete('/:userId', checkAuth, (req, res) => {
    const id = req.params.userId
    User.remove({_id: id}).exec()
    .then(results => {
        res.status(200).json({
            message: "User deleted Successfully"
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router;