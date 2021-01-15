const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
});

const House = mongoose.model('House', houseSchema);

exports.House = House;
