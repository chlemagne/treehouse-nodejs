const moongose = require('mongoose');
const express = require('express');
const {House} = require('../models/house');

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
router.post('/', async (req, res) => {
    const house = new House({ name: req.body.name });

    res.send(await house.save());
})

/*******************************************************************************
*** POST /api/houses
*******************************************************************************/
router.get('/:id', async (req, res) => {
    const house = await House.findById(req.params.id);

    res.send(house);
});

/*******************************************************************************
*** PUT /api/houses/id
*******************************************************************************/
router.put('/:id', async (req, res) => {
    const house = await House.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true }
    );

    res.send(house);
});

/*******************************************************************************
*** DELETE /api/houses/id
*******************************************************************************/
router.delete('/:id', async (req, res) => {
    const house = await House.findByIdAndDelete(req.params.id);

    res.send(house);
});

module.exports = router;
