const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.post('/', questionController.addQuestion);
router.delete('/:id', questionController.deleteQuestion);
router.put('/:id', questionController.editQuestion);
router.get('/:id/answers', questionController.getAnswersByQuestionId);

module.exports = router;