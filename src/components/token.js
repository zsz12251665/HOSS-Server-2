/**
 * 基于 JsonWebToken 的令牌签发及验证模块
 * @module token
 */

const config = require('@config/jwt.json');
const jwt = require('jsonwebtoken');

/**
 * 使用给定配置签发令牌
 * @param {object} content 要签发的令牌内容
 * @param {string} option 要签发的令牌配置名
 * @returns {string} 签发的令牌内容
 */
function encode(content, option = 'default') {
	const signOption = Object.assign({ issuer: config.issuer }, config.options[option] || config.options['default']);
	return jwt.sign(content, config.secret, signOption);
}

/**
 * 解密令牌
 * @param {string} token 签发的令牌内容
 * @returns {object | null} 返回 null 时表示令牌失效，否则返回令牌内容
 */
function decode(token) {
	try {
		return jwt.verify(token, config.secret, { issuer: config.issuer });
	} catch (err) {
		return null;
	}
}

module.exports = { encode, decode };
