const moongose = require('mongoose');
const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    res.send([
        { message: 'Hello, world!' }
    ]);
});

module.exports = router;
