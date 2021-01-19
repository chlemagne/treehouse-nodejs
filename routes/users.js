const _ = require('lodash');
const bycrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const {User, userValidationSchema } = require('../models/user');

const router = express.Router();

/*******************************************************************************
*** POST /api/users
*******************************************************************************/
router.post('/', async (req, res) => {
    const { error } = userValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('Email already exists.');

    user = await new User(_.pick(req.body, [
        'firstName', 'lastName', 'middleName', 'email', 'password'
    ]));
    const salt = await bycrypt.genSalt(10);
    user.password = await bycrypt.hash(req.body.password, salt);
    await user.save();

    res.send(_.pick(user, ['firstName', 'lastName', 'middleName', 'email']));
});

module.exports = router;
