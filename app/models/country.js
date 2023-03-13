const mongoose = require('mongoose');

const CountrySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
});

const Country = mongoose.model('Country', CountrySchema);

module.exports = Country;