const mongoose = require("mongoose");
const { isEmail } = require("validator"); //recall to install this

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: [true, "Please enter an Email"],
        lowercase: true,
        unique: true,
        validate: [isEmail, "Please enter a Valid Email"]
        
        // install validator for email checks
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Minimum Password length should be 6 Characters']
    }
})


module.exports = mongoose.model('User', userSchema);