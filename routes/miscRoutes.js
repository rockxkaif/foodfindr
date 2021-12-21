const express = require('express');
const router = express.Router();
const misc = require('../controllers/misc')
const catchAsync = require('../utils/catchAsync');

router.get('/contact_us', catchAsync(misc.renderContact))

router.get('/info', catchAsync(misc.renderAbout))

module.exports = router;