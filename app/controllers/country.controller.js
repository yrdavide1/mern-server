const Country = require('../models/country');

exports.getCountries = async (req, res) => {
    try {
        const countries = await Country.find({});
        res.status(200).send(countries);
    } catch (err) {
        res.status(500).send({ message: err });
    }
};