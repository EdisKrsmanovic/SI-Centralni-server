require('dotenv').config()
const jwt = require('jsonwebtoken')
const faDefintionService = require('../services/faDefintionService')

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

//{"naziv":"SCC Sarajevo","geotag":"43.85537342499372,18.40814328393261","tag":"SCC Centar"}
exports.createFaDefintion = function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    const user = decodeToken(token);

    if (user && user.uloga === "Admin") {
        faDefintionService.createFaDefintion(req.body, (status) => {
            if (status === "OK") {
                res.status(200).json({ message: "Successfully added FA Definition.", token: regenerateToken(req.body.token) });
            } else {
                res.status(500).json({ message: "Something went wrong when creating FA Definition." });
            }
        });
    } else {
        res.status(401).json({message: "Not authorized to perform action."})
    }
}

//{"id": 1}
//FA definicija se briše u odnosu na id
exports.deleteFaDefintion = function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    const user = decodeToken(token);

    if (user && user.uloga === "Admin") {

        faDefintionService.deleteFaDefintion(req.body.id, (status) => {
            if (status === "OK") {
                return res.status(200).send({ token: regenerateToken(req.body.token) });
            } else {
                return res.status(500).send({ message: "Something went wrong when deleting the FA definition." });
            }
        });
    } else {
        res.status(401).send({message: "Not authorized to perform action."})
    }
}

//{"id": 2, "naziv":"Novi SCC Sarajevo","geotag":"43.85537342499372,18.40814328393261","tag":"SCC Centar"}
//FA definicija se updejtuje u odnosu na id
exports.editFaDefintion = function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    const user = decodeToken(token);

    if (user && user.uloga === "Admin") {
        faDefintionService.editFaDefintion(req.body, (status) => {
            if (status === "OK") {
                return res.status(200).send({ token: regenerateToken(req.body.token) });
            } else {
                return res.status(500).send({ message: "Something went wrong when editing FA definition." });
            }
        });

    } else {
        res.status(401).send({message: "Not authorized to perform action."})
    }
}


exports.readFaDefintion = function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    const user = decodeToken(token);

    if (user) {
        faDefintionService.readFaDefinitions((response) => {
            if(response === "Error"){
                res.status(500).send({ message: "Something went wrong when editing FA definition." });
            } else {
                let faDefinitions = response;
                console.log(faDefinitions);
                faDefinitions.map(obj=>{return obj.geotag = obj.geotag.split(',').map(el=> parseFloat(el))});

                res.status(200).send(faDefinitions);
            }
        });

    } else {
        res.status(401).send({message: "Not authorized to perform action."})
    }
}
