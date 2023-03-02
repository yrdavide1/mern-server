const express = require("express");
const RecordModel = require("./models/record");
const app = express();
const verifySignUp = require('./middlewares').verifySignUp;
const authController = require('./controllers/auth.controller');

app.use((request, response, next) => {
    response.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

app.post(
        '/register',
        [
            verifySignUp.checkDuplicates,
            verifySignUp.checkRoles
        ],
        authController.register
    );

app.post('/login', authController.login);

app.post('/record/add', async (request, response) => {
    const record = new RecordModel(request.body);
    try {
        await record.save();
        response.send(record);
    } catch (error) {
        response.status(500).send({ message: error });
    }
});

app.get('/records', async (request, response) => {
    try {
        const records = await RecordModel.find({});
        response.send(records);
    } catch (error) {
        response.status(500).send({ message: error });
    }
});

app.delete('/record/delete/:id', async (request, response) => {
    try {
        const deletedRecord = await RecordModel.findByIdAndRemove({ _id: request.params.id });
        response.send(deletedRecord);
    } catch {
        response.status(500).send({ message: error });
    }
});

app.put('/record/update/:id', async (request, response) => {
    const record = new RecordModel(request.body);
    
    try {
        const recordToUpdate = await RecordModel.findByIdAndUpdate(
            request.params.id,
            {
                name: record.name,
                surname: record.surname,
                level: record.level,
                salary: record.salary
            }
        );
        response.send(recordToUpdate);
    } catch (error) {
        response.status(500).send({ message: error });
    }
});

module.exports = app;

