const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const express = require('express');

const router = express.Router();
const authValidation = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
});

/*******************************************************************************
*** POST /api/auth
*******************************************************************************/
router.post('/', async (req, res) => {
    const { error } = authValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(401).send('Invalid email or password.');

    res.send({ 'x-auth-token': user.genAuthToken() });
});



module.exports = router;
