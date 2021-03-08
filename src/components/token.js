/*
token 模块：JsonWebToken 令牌签发及验证

- token.encode(payload: object, option: string = 'default'): string：使用名为 option 的配置签发令牌
- token.decode(token: string): object | null：解密令牌（若失败则返回 null）
*/

const config = require('../config/jwt.json');
const jwt = require('jsonwebtoken');

module.exports = {
	encode: (payload, option = 'default') => jwt.sign(payload, config.secret, Object.assign({ issuer: config.issuer }, config.options[option])),
	decode: token => {
		try {
			return jwt.verify(token, config.secret, { issuer: config.issuer });
		} catch (err) {
			return null;
		}
	}
};
