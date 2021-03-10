/*
管理员登录接口

POST 请求字段

- username：用户名
- password：密码

返回结果

- HTTP 200 OK：一个 JWT 令牌，作用户令牌
- HTTP 400 Bad Request：'Incomplete form!'，请求字段有误
- HTTP 401 Unauthorized：'Login failed!'，账号密码未通过验证（账号密码错误）
*/

const config = require('../../config/admin.json');
const token = require('../../components/token');
const express = require('express');

const router = express.Router();

function processRequest(req) {
	const { username, password } = req.body;
	if (!(username && password))
		return { status: 400, message: 'Incomplete form!' };
	if (username == config.username && password == config.password)
		return { status: 200, message: token.encode({ user: username, role: 'admin' }, 'userToken') };
	else
		return { status: 401, message: 'Login failed!' };
}

router.post('/', (req, res) => {
	const { status, message } = processRequest(req);
	res.status(status).type('text/plain').send(message);
});

module.exports = router;
