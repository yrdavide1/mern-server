const { authJwt } = require('../middlewares');
const controller = require('../controllers/country.controller');

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    app.get('/countries', [authJwt.verifyToken], controller.getCountries);
};