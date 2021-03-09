/*
作业上传接口

PUT 请求字段

返回结果

HTTP 501 Not Implemented：'Function not implemented!'，功能未实现

*/

const express = require('express');

const router = express.Router();

router.put('/', (req, res) => {
	res.status(501).type('text/plain').send('Function not implemented!');
});

module.exports = router;
