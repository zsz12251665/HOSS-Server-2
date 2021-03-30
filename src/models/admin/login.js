const config = require('../../config/admin.json');
const token = require('../../components/token');
const express = require('express');

const router = express.Router();

function processRequest(req) {
	const { username, password } = req.body;
	if (!username || !password)
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
