const controller = require('../controllers/user.controller');
const { authJwt } = require('../middlewares');

module.exports = function (app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.put("/modifyUserInfo/:id", [authJwt.verifyToken], controller.modifyUserInfo);

    app.put("/modifyUserRoles", [authJwt.verifyToken], controller.modifyUserRoles);
};