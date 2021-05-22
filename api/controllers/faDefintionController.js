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

//{"Naziv":"SCC Sarajevo","GeoTag":"43.85537342499372,18.40814328393261","Tag":"SCC Centar"}
exports.createFaDefintion = function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    const user = decodeToken(token);

    if (user && user.Uloga === "Admin") {

        const {Naziv, GeoTag, Tag} = req.body;

        const status = faDefintionService.createFaDefintion({ "Naziv": Naziv, "GeoTag": GeoTag, "Tag": Tag });
        if (status === "OK") {
            return res.status(200).json({ message: "Successfully added FA Definition.", token: regenerateToken(req.body.token) });
        } else {
            return res.status(500).json({ message: "Something went wrong when creating FA Definition." });
        }
    }
    res.status(401).json({ message: "Not authorized to perform action." })
}

//{"Naziv":"BBI Sarajevo"}
//FA definicija se briše u odnosu na Naziv
exports.deleteFaDefintion = function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    const user = decodeToken(token);

    if (user && user.Uloga === "Admin") {

        const status = faDefintionService.deleteFaDefintion(req.body.Naziv);
        if (status === "OK") {
            return res.status(200).send({ token: regenerateToken(req.body.token) });
        } else {
            return res.status(500).send({ message: "Something went wrong when deleting the FA definition." });
        }
    }
    res.status(401).send({ message: "Not authorized to perform action." })
}

//{"Naziv":"SCC Sarajevo","GeoTag":"43.85537342499372,18.40814328393261","Tag":"SCC Centar"}
//FA definicija se updejtuje u odnosu na Naziv
exports.editFaDefintion = function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    const user = decodeToken(token);

    if (user && user.Uloga === "Admin") {
        const {Naziv, GeoTag, Tag} = req.body;

        const status = faDefintionService.editFaDefintion({ "Naziv": Naziv, "GeoTag": GeoTag, "Tag": Tag });
        if (status === "OK") {
            return res.status(200).send({ token: regenerateToken(req.body.token) });
        } else {
            return res.status(500).send({ message: "Something went wrong when editing FA definition." });
        }
    }
    res.status(401).send({ message: "Not authorized to perform action." })
}


exports.readFaDefintion = function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    const user = decodeToken(token);

    if (user) {
        const faDefintions = faDefintionService.readFaDefintions();
        faDefintions.map(obj=>{return obj.GeoTag = obj.GeoTag.split(',').map(el=> parseFloat(el))});
        
        return res.status(200).send(faDefintions);
    }
    res.status(401).send({ message: "Not authorized to perform action." })
}