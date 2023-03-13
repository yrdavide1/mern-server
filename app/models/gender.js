const mongoose = require('mongoose');

const GenderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Gender = mongoose.model('Gender', GenderSchema);

module.exports = Gender;