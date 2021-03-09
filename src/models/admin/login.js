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

const token = require('../../components/token');
const express = require('express');

const router = express.Router();

function login(username, password) { // 验证账号密码并生成用户令牌（验证未实现）
	if (!username || !password)
		return null;
	return token.encode({ user: username, role: 'admin' }, 'userToken');
}

router.post('/', (req, res) => {
	const username = req.body.username, password = req.body.password;
	if (username && password) {
		const token = login(username, password);
		if (token)
			res.status(200).type('text/plain').send(token);
		else
			res.status(401).type('text/plain').send('Login failed!');
	} else
		res.status(400).type('text/plain').send('Incomplete form!');
});

module.exports = router;
