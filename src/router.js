const express = require('express');

const router = express.Router();

// 在此处转发 /api 的请求
router.use('/admin/login', require('./models/admin/login'));
router.use('/homework/list', require('./models/user/list'));
router.use('/homework/upload', require('./models/user/upload'));
router.use('/homework/download', require('./models/admin/download'));
router.use('/homework/manage', require('./models/admin/manage/homework'));
router.use('/student/manage', require('./models/admin/manage/student'));
router.use('/student/validate', require('./models/user/validate'));

module.exports = router;
