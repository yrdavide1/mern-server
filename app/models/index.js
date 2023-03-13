const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require('./user');
db.role = require('./role');
db.record = require('./record');
db.country = require('./country');

db.ROLES = ['user', 'admin'];
db.COUNTRIES = require('../resources/countries.json');

module.exports = db;