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
    dateOfBirth: {
        type: Date,
        required: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        $set: v => v.Date.now()
    }
}, { timestamps: true });

const Record = mongoose.model('Record', RecordSchema);

module.exports = Record;