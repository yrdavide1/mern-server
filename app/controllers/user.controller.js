const models = require('../models');
const User = models.user;
const bcrypt = require('bcryptjs');
const Role = require('../models/role');

/**
 * Can modify all fields except for roles.
 * Checkout modifyRoles API if necessary.
 */
exports.modifyUserInfo = (req, res) => {
    const user = new User(req.body);

    User.findByIdAndUpdate(
        req.params.id,
        {
            username: user.username,
            email: user.email,
            password: bcrypt.hashSync(user.password, 8)
        },
        (err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                res.status(404).send({ message: 'User not found!' });
                return;
            }

            res.status(200).send({ message: 'User updated successfully!' });
        }
    );
};

exports.modifyUserRoles = (req, res) => {
    User.findById(req.body.id, (err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (!user) {
            res.status(404).send({ message: "User not found!" });
            return;
        }

        Role.find(
            { _id: { $in: user.roles } },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                if (!roles.map(r => r.name).includes('admin')) {
                    res.status(403).send({ message: "Only admin users are enabled to modify roles!" });
                    return;
                }

                User.findById(req.body.toBeModifiedId, (err, userToBeModified) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
            
                    if (!userToBeModified) {
                        res.status(404).send({ message: 'User not found!' });
                        return
                    }
            
                    if (req.body.roles) {
                        Role.find(
                            { name: { $in: req.body.roles } },
                            (err, rolesToBeModified) => {
                                if (err) {
                                    res.status(500).send({ message: err });
                                    return;
                                }

                                if (!rolesToBeModified.length) {
                                    res.status(403).send({ message: 'Invalid role(s)!' });
                                    return;
                                }
            
                                userToBeModified.roles = rolesToBeModified.map(r => r._id);
                                userToBeModified.save(err => {
                                    if (err) {
                                        res.status(500).send({ message: err });
                                        return;
                                    }
            
                                    res.status(200).send({ message: 'Roles updated successfully!' });
                                });
                            }
                        );
                    } else {
                        res.status(400).send({ message: 'Roles not provided!' });
                        return;
                    }
                });
            }
        );
    });
};