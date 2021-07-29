const { User } = require('@components/db');

/** 用户注册 */
module.exports = async function (req, res, next) {
	const { username, password } = req.body;
	if (!username || !password)
		return next({ status: 400, message: 'The username and password should not be empty!' });
	const user = await User.findByPk(username);
	if (user)
		return next({ status: 403, message: 'The username has been taken!' });
	else {
		await User.create({ identification: username, certificate: password });
		return next({ status: 201, message: `User ${username} has been created!` });
	}
};
