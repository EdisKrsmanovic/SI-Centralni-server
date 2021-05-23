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

    userService.findUser(email, (user) => {
        if(user) {
            bcrypt.compare(password, user.password, function (error, matched) {
                if (matched) {
                    // Useru ne vraćamo njegov hashirani password
                    user.password = undefined;
                    res.send({token: createToken(user)});
                } else {
                    res.sendStatus(403);
                }
            });
        } else {
            res.status(500).send({ message: "Something went wrong while logging in" });
        }
    });

}

