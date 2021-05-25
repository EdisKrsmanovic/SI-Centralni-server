const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/create', userController.createUser);

router.delete('/delete', userController.deleteUser);

router.put('/assignRole', userController.assignRole);

router.get('/all', userController.readUsers);

router.get('', userController.readUser);

router.get('/me', userController.readMe);

router.post('/update', userController.updateUser);

module.exports = router;
