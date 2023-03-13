const RecordModel = require("../models/record");
const CountryModel = require("../models/country");
const moment = require('moment');

exports.addRecord = (req, res) => {
    const record = new RecordModel({
        name: req.body.name,
        surname: req.body.surname,
        dateOfBirth: moment(req.body.dateOfBirth, 'YYYY-MM-DD').toISOString(true)
    });

    record.save((err, record1) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (!req.body.country) {
            res.status(403).send({ message: "Country not provided!" });
            return;
        }

        CountryModel.findOne(
            { 
                code: req.body.country.code,
                name: req.body.country.name
            },
            (err, country) =>{
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                if (!country) {
                    res.status(404).send({ message: "Country not found!" });
                    return;
                }

                record1.country = country._id;
                record1.save((err, record2) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    res.status(200).send(
                        {
                            message: 'Record was added successfully',
                            record: {
                                name: record2.name,
                                surname: record2.surname,
                                dateOfBirth: record2.dateOfBirth,
                                country: record2.country,
                                createdAt: record2.createdAt,
                                updatedAt: record2.updatedAt
                            }
                        }
                    );
                });
            }
        );
    });
};

exports.updateRecord = async (req, res) => {
    RecordModel.findById(req.body.id, (err, record1) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (!record1) {
            res.status(404).send({ message: 'Record not found!' });
            return;
        }

        CountryModel.findOne(
            {
                code: req.body.record.country.code,
                name: req.body.record.country.name
            },
            (err, country) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                if (!country) {
                    res.status(404).send({ message: "Country not found!" });
                    return; 
                }

                record1.name = req.body.record.name;
                record1.surname = req.body.record.surname;
                record1.dateOfBirth = req.body.record.dateOfBirth;
                record1.country = country._id;
                record1.save((err, record2) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    res.status(200).send(
                        {
                            message: 'Record was updated successfully',
                            record: {
                                name: record2.name,
                                surname: record2.surname,
                                dateOfBirth: record2.dateOfBirth,
                                country: record2.country,
                                createdAt: record2.createdAt,
                                updatedAt: record2.updatedAt
                            }
                        }
                    );
                });
            }
        );
    });
};

exports.getRecords = (req, res) => {
    RecordModel.find({}, (err, records) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        const result = records.map(r => {
            return {
                name: r.name,
                surname: r.surname,
                dateOfBirth: r.dateOfBirth,
                country: r.country,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt
            }
        });
        res.status(200).send(result);
    });
};

exports.deleteRecord = async (req, res) => {
    try {
        const deletedRecord = await RecordModel.findByIdAndRemove({ _id: req.params.id });
        res.status(200).send(
            {
                message: 'Record was deleted successfully',
                record: {
                    name: deletedRecord.name,
                    surname: deletedRecord.surname,
                    dateOfBirth: deletedRecord.dateOfBirth,
                    country: deletedRecord.country,
                    createdAt: deletedRecord.createdAt,
                    updatedAt: deletedRecord.updatedAt
                }
            }
        );
    } catch {
        res.status(500).send({ message: error });
    }
};