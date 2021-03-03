/*
jwt 模块：JsonWebToken 令牌签发及验证

- jwt.encode(payload: object, optionName: string): string：签发令牌
- jwt.decode(token: string): object | null：解密令牌（若失败则返回 null）
*/

const config = require('../config/jwt.json');
const jwt = require('jsonwebtoken');

module.exports = {
	encode: (payload, optionName) => jwt.sign(payload, config.secret, Object.assign({ issuer: config.issuer }, config.options[optionName])),
	decode: token => {
		try {
			return jwt.verify(token, config.secret, { issuer: config.issuer });
		} catch (err) {
			return null;
		}
	}
};
