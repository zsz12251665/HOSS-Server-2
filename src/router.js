const express = require('express');

const router = express.Router();

// 在此处转发 /api 的请求
router.use('/admin/login', require('./models/admin/login'));
router.use('/homework/list', require('./models/user/list'));
router.use('/homework/upload', require('./models/user/upload'));
router.use('/student/validate', require('./models/user/validate'));

module.exports = router;
