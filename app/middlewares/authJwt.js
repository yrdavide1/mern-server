const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../models');
const Role = db.role;
const User = db.user;

verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) return res.status(403).send({message: 'No token provided!'});

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).send({message: 'Unauthorized!'});
            return;
        }

        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }

        Role.find(
            { _id: { $in: user.roles } },
            (err, roles) => {
                if (err) {
                    res.status(500).send({message: err});
                    return;
                }

                roles.includes('admin') ? next() : res.status(403).send({message: 'Admin role is required!'});
                return;
            }
        );
    });
};

isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }

        Role.find(
            { _id: { $in: user.roles } },
            (err, roles) => {
                if (err) {
                    res.status(500).send({message: err});
                    return;
                }

                roles.includes('moderator') ? next() : res.status(403).send({message: 'Moderator role is required!'});
                return;
            }
        );
    });
}

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
};

module.exports = authJwt;