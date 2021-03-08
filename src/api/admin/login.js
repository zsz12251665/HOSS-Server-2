const token = require('../../components/token');

function identityValid(username, password) {
	return username && password; // 验证账号密码，未实现
}

module.exports = (req, res) => {
	const username = req.body.username, password = req.body.password;
	if (username && password)
		if (identityValid(username, password))
			res.status(200).type('text/plain').send(token.encode({ user: username, role: 'admin' }, 'userToken'));
		else
			res.status(401).type('text/plain').send('Login failed!');
	else
		res.status(400).type('text/plain').send('Incomplete form!');
};
