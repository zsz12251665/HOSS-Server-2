/*
token 模块：JsonWebToken 令牌签发及验证

- token.encode(payload: object, option: string = 'default'): string：使用名为 option 的配置签发令牌
- token.decode(token: string): object | null：解密令牌（若失败则返回 null）
*/

const config = require('../config/jwt.json');
const jwt = require('jsonwebtoken');

function encode(payload, option = 'default') {
	const signOption = Object.assign({ issuer: config.issuer }, config.options[option]);
	return jwt.sign(payload, config.secret, signOption);
}

function decode(token) {
	try {
		return jwt.verify(token, config.secret, { issuer: config.issuer });
	} catch (err) {
		return null;
	}
}

function authorizationController(req, res, next) {
	const adminToken = req.get('Authorization');
	if (decode(adminToken) === null)
		res.status(401).type('text/plain').send('Invalid Token!');
	else
		next();
}

module.exports = { encode, decode, authorizationController };
