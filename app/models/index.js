const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require('./user');
db.role = require('./role');
db.record = require('./record');

db.ROLES = ['user', 'admin', 'moderator'];

module.exports = db;