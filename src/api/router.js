const express = require('express');

const router = express.Router();

/* 在此处处理 /api 的请求 */

router.post('/admin/login', require('./admin/login')); // 管理员登录

module.exports = router;
