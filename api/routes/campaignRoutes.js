const express = require('express');
const router = express.Router();
const campgainController = require('../controllers/campaignController');

router.get('/all', campgainController.getAllCampaigns);
router.post('/add', campgainController.createCampaign);
router.post('/edit', campgainController.editCampaign);
router.delete('/delete/:campaignid', campgainController.deleteCampaign);
router.get('/:campaignid', campgainController.getCampaignById);

module.exports = router;