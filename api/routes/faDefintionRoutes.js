const express = require('express');
const router = express.Router();
const faDefintionController = require('../controllers/faDefintionController');

router.post('/create', faDefintionController.createFaDefintion);

router.delete('/delete', faDefintionController.deleteFaDefintion);

router.put('/edit', faDefintionController.editFaDefintion);

router.get('/all', faDefintionController.readFaDefintion);

router.get('', faDefintionController.readFaById);

module.exports = router;