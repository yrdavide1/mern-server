const models = require('../models');
const User = models.user;
const Role = models.role;
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (req.body.roles) {
            Role.find(
                { name: { $in: req.body.roles } },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    user.roles = roles.map(r => r._id);
                    user.save(err => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        res.send({ message: 'User was registered successfully!' });
                    });
                }
            );
        } else {
            Role.findOne({ name: 'user' }, (err, role) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                user.roles = [role._id];
                user.save(err => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    res.send({ message: 'User was registered successfully!' });
                });
            });
        }
    });
};

exports.login = (req, res) => {
    User.findOne(
        { username: req.body.username }
    )
        .populate('roles', '-__v')
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                res.status(404).send({ message: 'User not found!' });
                return;
            }

            const isPasswordValid = (user.password === req.body.password);

            if (!isPasswordValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: 'Invalid password!'
                });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 }); // lasts 24 hours
            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                password: user.password,
                accessToken: token
            });
        });
};