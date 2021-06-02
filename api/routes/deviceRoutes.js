const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

router.post('/activate/:code', deviceController.activateDevice);
router.post('/response/save', deviceController.saveResponse);
router.post('/response/get', deviceController.getResponses);
router.post('/dependent/add', deviceController.addDependent);
router.post('/dependent/remove', deviceController.removeDependent);
router.get('/dependent/get/:deviceId', deviceController.getDependent);
router.get('/response/count', deviceController.countResponses);
router.post('/edit', deviceController.editDevice);
router.get('/duration', deviceController.getDurationResponseOfUser);

module.exports = router;