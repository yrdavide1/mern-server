const controller = require('../controllers/record.controller');
const { authJwt } = require('../middlewares');

module.exports = function (app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post('/record/add', [authJwt.verifyToken], controller.addRecord);
    
    app.get('/records', [authJwt.verifyToken], controller.getRecords);
    
    app.delete('/record/delete/:id', [authJwt.verifyToken], controller.deleteRecord);
    
    app.put('/record/update', [authJwt.verifyToken], controller.updateRecord);
};