require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const userService = require('../services/userService')

const createToken = user => {
    return jwt.sign(
        {
            user
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        },
    );
};

const regenerateToken = jwt => {
    jwt.verify(jwt, process.env.JWT_SECRET, (err, user) => {
        return jwt.sign(
            {
                user
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            },
        );
    })
}

exports.login = function (req, res) {
    const {email, password} = req.body;

    if (!email || !password) {
        res.send(400);
    }

    const user = userService.findUser(email);
    bcrypt.compare(password, user.Password, function (error, matched) {
        if (matched) {
            // Useru ne vraćamo njegov hashirani password
            user.Password = undefined;
            res.send({token: createToken(user)});
        } else {
            res.sendStatus(403);
        }
    });
}

