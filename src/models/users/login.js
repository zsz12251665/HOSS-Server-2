const { User } = require('@components/db');
const hash = require('@components/hash');
const token = require('@components/token');

/** 用户登录验证并派发令牌 */
module.exports = async function (req, res, next) {
	const { username, password, tokenType } = req.body;
	if (!username || !password)
		return next({ status: 400, message: 'The username and password should not be empty!' });
	if (req.params.username && req.params.username !== username)
		return next({ status: 401, message: 'The user does not match!' });
	const user = await User.findOne({ where: { identification: username, certificate: hash(password) } });
	if (user)
		return next({ status: 200, message: token.encode({ username }, tokenType || 'userToken') });
	else
		return next({ status: 403, message: 'The username or password does not match!' });
};
