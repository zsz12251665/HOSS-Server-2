const express = require('express');

const router = express.Router();

/* 在此处转发 /api 的请求 */

router.use('/admin/login', require('./models/admin/login'));
router.use('/homework/upload', require('./models/homework/upload'));

module.exports = router;
