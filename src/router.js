const express = require('express');

const router = express.Router();

// 在此处转发 /api 的请求
router.post('/login', require('@/models/users/login'));
router.post('/register', require('@/models/users/register'));
router.post('/users', require('@/models/users/register'));
router.post('/users/:username/token', require('@/models/users/login'));

module.exports = router;
