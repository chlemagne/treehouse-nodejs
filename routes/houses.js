const moongose = require('mongoose');
const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {House, houseValidationSchema} = require('../models/house');
const validateObjectId = require('../middleware/validation/objectid');

const router = express.Router();

/*******************************************************************************
*** GET /api/houses
*******************************************************************************/
router.get('/', async (req, res) => {
    const houses = await House.find().sort('-dateAdded');
    res.status(200).json(houses);
});

/*******************************************************************************
*** GET /api/houses/id
*******************************************************************************/
router.post('/', auth, async (req, res) => {
    const { error } = houseValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const house = new House({ name: req.body.name });

    res.send(await house.save());
});

/*******************************************************************************
*** POST /api/houses
*******************************************************************************/
router.get('/:id', [validateObjectId], async (req, res) => {
    const house = await House.findById(req.params.id);

    if (!house) return res.status(404).send('House with the given ID was not found.');

    res.send(house);
});

/*******************************************************************************
*** PUT /api/houses/id
*******************************************************************************/
router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const { error } = houseValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const house = await House.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true }
    );

    if (!house) return res.status(404).send('House with the given ID was not found.');

    res.send(house);
});

/*******************************************************************************
*** DELETE /api/houses/id
*******************************************************************************/
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const house = await House.findByIdAndDelete(req.params.id);

    if (!house) return res.status(404).send('House with the given ID was not found.');

    res.send(house);
});

module.exports = router;
