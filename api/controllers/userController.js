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
    if (user != null && user.Uloga == "Admin") {
        role = null;
        if (typeof req.body.uloga === 'undefined') {
            role = "User";
        }
        else {
            role = req.body.uloga;
        }
        status = userService.createUser({ "Email": req.body.email, "Password": req.body.password, "Uloga": role });
        if (status == "OK") {
            return res.status(200).json({ token: regenerateToken(req.body.token) });
        } else {
            return res.status(500).json({ message: "Something went wrong when creating the user." });
        }
    }
    res.status(401).json({ message: "Users are not authorized to perform action." })
}

//request sadrži email
//u response-u se dobija novi jwt za admina koji je poslao zahtjev
//potrebno provjeriti da li je admin poslao zahtjev
//potrebno provjeriti da li admin pokusava obrisati sam sebe
exports.deleteUser = function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    user = decodeToken(token);
    if (user != null && user.Uloga == "Admin") {
        if (user.Email != req.body.email) {
            status = userService.deleteUser(req.body.email);
            if (status == "OK") {
                return res.status(200).send({ token: regenerateToken(req.body.token) });
            } else {
                return res.status(500).send({ message: "Something went wrong when deleting the user." });
            }
        } else {
            return res.status(403).send({ message: "Administrator is not allowed to delete his own account." });
        }
    }
    res.status(401).send({ message: "Users are not authorized to perform action." })
}

//request sadrži email i rolu
//u response-u se dobija novi jwt za admina koji je poslao zahtjev
//potrebno provjeriti da li je admin poslao zahtjev
exports.assignRole = function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    user = decodeToken(token);
    if (user != null && user.Uloga == "Admin") {
        status = userService.editRole({ "Email": req.body.email, "Uloga": req.body.uloga });
        if (status == "OK") {
            return res.status(200).send({ token: regenerateToken(req.body.token) });
        } else {
            return res.status(500).send({ message: "Something went wrong when assigning a new role to user." });
        }
    }
    res.status(401).send({ message: "Users are not authorized to perform action." })
}

//u response-u se vraćaju svi korisnici i novi jwt za admina koji je poslao zahtjev
//potrebno provjeriti da li je admin poslao zahtjev
exports.readUsers = function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    user = decodeToken(token);
    if (user != null && user.Uloga == "Admin") {
        users = userService.readUsers();
        return res.status(200).send(users);
    }
    res.status(401).send({ message: "Users are not authorized to perform action." })
}