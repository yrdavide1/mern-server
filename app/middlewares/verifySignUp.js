const db = require('../models');
const User = db.user;
const ROLES = db.ROLES;

checkDuplicates = (req, res, next) => {
    User.findOne(
        { username: req.body.username }
    ).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (user) {
            res.status(400).send({ message: 'Username is already in use!' });
            return;
        }

        User.findOne(
            { email: req.body.email }
        ).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (user) {
                res.status(400).send({ message: 'Email is already in use!' });
                return;
            }

            next();
        });
    });
};

checkRoles = (req, res, next) => {
    const reqRoles = req.body.roles;
    if (reqRoles) {
        reqRoles.forEach(r => {
            if (!ROLES.includes(r)) {
                res.status(400).send({message: `Invalid role! ${r} role does not exist!`});
                return;
            }
        });
    }

    next();
};

const verifySignUp = {
    checkDuplicates,
    checkRoles
};

module.exports = verifySignUp;