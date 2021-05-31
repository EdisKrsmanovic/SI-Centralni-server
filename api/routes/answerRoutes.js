const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');

router.post('/', answerController.createAnswer);
router.get('/:id', answerController.getAnswerById);
router.delete('/:id', answerController.deleteAnswerById);

module.exports = router;