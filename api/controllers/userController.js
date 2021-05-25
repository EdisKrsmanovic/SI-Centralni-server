require('dotenv').config()
const jwt = require('jsonwebtoken')
const userService = require('../services/userService')

function decodeToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            return null;
        }
        return payload.user;
    })
}

//možda se može izbjeći ovo ponavljanje koda ali neka bude tu zasad
function regenerateToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
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

//request sadrži token, email, password i opcionalno ulogu - defaultna vrijednost za ulogu je User
//u response-u se dobija novi jwt za admina koji je poslao zahtjev
//potrebno provjeriti da li je admin poslao zahtjev
exports.createUser = function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    user = decodeToken(token);
    if (user != null && user.uloga === "Admin") {
        role = null;
        if (typeof req.body.uloga === 'undefined') {
            role = "User";
        }
        else {
            role = req.body.uloga;
        }
        userService.createUser({ "email": req.body.email, "password": req.body.password, "uloga": role }, (status) => {
            if (status === "OK") {
                return res.status(200).json({ token: regenerateToken(req.body.token) });
            } else {
                return res.status(500).json({ message: "Something went wrong when creating the user." });
            }
        });
    } else {
        res.status(401).json({ message: "Users are not authorized to perform action." })
    }
}

//request sadrži email
//u response-u se dobija novi jwt za admina koji je poslao zahtjev
//potrebno provjeriti da li je admin poslao zahtjev
//potrebno provjeriti da li admin pokusava obrisati sam sebe
exports.deleteUser = function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    user = decodeToken(token);
    if (user != null && user.uloga === "Admin") {
        if (user.email !== req.body.email) {
            status = userService.deleteUser(req.body.email, () => {
                if (status === "OK") {
                    return res.status(200).send({ token: regenerateToken(req.body.token) });
                } else {
                    return res.status(500).send({ message: "Something went wrong when deleting the user." });
                }
            });
        } else {
            return res.status(403).send({ message: "Administrator is not allowed to delete his own account." });
        }
    } else {
        res.status(401).send({ message: "Users are not authorized to perform action." })
    }
}

//request sadrži email i rolu
//u response-u se dobija novi jwt za admina koji je poslao zahtjev
//potrebno provjeriti da li je admin poslao zahtjev
exports.assignRole = function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    user = decodeToken(token);
    if (user != null && user.uloga === "Admin") {
        status = userService.editRole({ "email": req.body.email, "uloga": req.body.uloga }, () => {
            if (status === "OK") {
                return res.status(200).send({ token: regenerateToken(req.body.token) });
            } else {
                return res.status(500).send({ message: "Something went wrong when assigning a new role to user." });
            }
        });
    } else {
        res.status(401).send({ message: "Users are not authorized to perform action." })
    }
}

//u response-u se vraćaju svi korisnici i novi jwt za admina koji je poslao zahtjev
//potrebno provjeriti da li je admin poslao zahtjev
exports.readUsers = function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    user = decodeToken(token);
    if (user != null && user.uloga === "Admin") {
        userService.readUsers((status, data) => {
            res.status(status).send(data);
        });
    } else {
        res.status(401).send({ message: "Users are not authorized to perform action." })
    }
}

//prima id i vraća korisnika sa tim id
exports.readUser = function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    user = decodeToken(token);
    if (user != null) {
        status = userService.readUser(req.body.id, (user) => {
            if (user != null) {
                return res.status(200).send({ user, token: regenerateToken(req.body.token) });
            } else {
                return res.status(500).send({ message: "Something went wrong retrieving the user." });
            }
        });
    } else {
        res.status(401).send({ message: "Invalid token." })
    }
}

exports.readMe = function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    user = decodeToken(token);
    if (user != null) {
        return res.status(200).send({ user, token: regenerateToken(req.body.token) });
    } else {
        res.status(401).send({ message: "Invalid token." })
    }
}

//prima id korisnika koji se updatea i email/password
exports.updateUser = function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    user = decodeToken(token);
    if (user != null) {
        if (!(typeof req.body.email === 'undefined') && !(typeof req.body.password === 'undefined')) {
            status = userService.editUser({ "id": req.body.id, "email": req.body.email, "password": req.body.password }, () => {
                if (status === "OK") {
                    return res.status(200).send({ token: regenerateToken(req.body.token) });
                } else {
                    return res.status(500).send({ message: "Something went wrong when editing the user." });
                }
            });
        }
        else if (!(typeof req.body.password === 'undefined')) {
            status = userService.editUserPassword({ "id": req.body.id,  "password": req.body.password }, () => {
                if (status === "OK") {
                    return res.status(200).send({ token: regenerateToken(req.body.token) });
                } else {
                    return res.status(500).send({ message: "Something went wrong when editing the password." });
                }
            });
        } else if (!(typeof req.body.email === 'undefined')){
            status = userService.editUserEmail({ "id": req.body.id, "email": req.body.email }, () => {
                if (status === "OK") {
                    return res.status(200).send({ token: regenerateToken(req.body.token) });
                } else {
                    return res.status(500).send({ message: "Something went wrong when editing the email." });
                }
            });
        }
    } else {
        res.status(401).send({ message: "Invalid token." })
    }
}