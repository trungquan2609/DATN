const express = require('express');
const router = express.Router();

const siteController = require('../../app/controllers/site/SiteController');

router.get('/intro', siteController.intro);
router.get('/', siteController.index);

module.exports = router;
