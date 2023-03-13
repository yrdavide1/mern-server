const jwt = require('jsonwebtoken');
require('dotenv').config();

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

const authJwt = {
    verifyToken
};

module.exports = authJwt;