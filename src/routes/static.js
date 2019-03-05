const express = require('express');
// router instance
const router = express.Router();
const staticController = require('../controllers/staticController')

// routes --> route handler
router.get('/', staticController.index);

module.exports = router;
