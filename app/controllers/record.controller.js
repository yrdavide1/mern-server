const RecordModel = require("../models/record");

exports.addRecord = async (req, res) => {
    const record = new RecordModel(req.body);
    try {
        await record.save();
        res.send(record);
    } catch (error) {
        res.status(500).send({ message: error });
    }
};

exports.getRecords = async (req, res) => {
    try {
        const records = await RecordModel.find({});
        res.send(records);
    } catch (err) {
        res.status(500).send({ message: err });
    }
};

exports.deleteRecord = async (req, res) => {
    try {
        const deletedRecord = await RecordModel.findByIdAndRemove({ _id: req.params.id });
        res.send(deletedRecord);
    } catch {
        res.status(500).send({ message: error });
    }
};

exports.updateRecord = async (req, res) => {
    const record = new RecordModel(req.body);
        
    try {
        const recordToUpdate = await RecordModel.findByIdAndUpdate(
            req.params.id,
            {
                name: record.name,
                surname: record.surname,
                level: record.level,
                salary: record.salary
            }
        );
        res.send(recordToUpdate);
    } catch (error) {
        res.status(500).send({ message: error });
    }
};