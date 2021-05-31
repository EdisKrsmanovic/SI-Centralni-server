const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

router.get('/activeNotActive/all', deviceController.readActiveNotActiveFadevice);
router.post('/activate/:code', deviceController.activateDevice);
router.post('/response/save', deviceController.saveResponse);
router.post('/response/get', deviceController.getResponses);
router.post('/dependent/add', deviceController.addDependent);
router.get('/dependent/get/:deviceId', deviceController.getDependent);
router.get('/response/count', deviceController.countResponses);

module.exports = router;