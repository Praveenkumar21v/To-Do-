const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.get('/', sessionController.authenticateUser, sessionController.getSessions);

module.exports = router;
