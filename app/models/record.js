const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    }
}, { versionKey: false });

const Record = mongoose.model('Record', RecordSchema);

module.exports = Record;