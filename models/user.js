const Joi = require('joi');
const config = require('config');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    middleName: {
        type: String,
        default: '',
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    roles: {
        type: [String],
        default: []
    }
});

userSchema.methods.hashPassword = async function() {
    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);
};

userSchema.methods.genAuthToken = function() {
    const payload = {
        _id: this.id,
        roles: this.roles
        // add data above this line
    };
    return jwt.sign(payload, config.get('jwtPrivateKey'));
};

const User = mongoose.model('User', userSchema);

const validationSchema = Joi.object({
    firstName: Joi.string().min(5).max(50).required(),
    lastName: Joi.string().min(5).max(50).required(),
    middleName: Joi.string().max(50).allow(null, ''),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(1024).required()
});

exports.User = User;
exports.userValidationSchema = validationSchema;
