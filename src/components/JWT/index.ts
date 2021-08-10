import config from '@config/jwt.json'
import options from './options'
import jwt from 'jsonwebtoken'

/**
 * 使用给定配置签发令牌
 * @param {object} content 要签发的令牌内容
 * @param {string} option 要签发的令牌配置名
 * @returns {string} 签发的令牌内容
 */
export function encode(content: object, option: string = 'default'): string {
	const signOption = Object.assign({ issuer: config.issuer }, options.get(options.has(option) ? option : 'default'))
	return jwt.sign(content, config.secret, signOption)
}

/**
 * 解密令牌
 * @param {string} token 签发的令牌内容
 * @returns {jwt.JwtPayload | null} 返回 null 时表示令牌失效，否则返回令牌内容
 */
export function decode(token: string): jwt.JwtPayload | null {
	try {
		return <jwt.JwtPayload>jwt.verify(token, config.secret, { issuer: config.issuer })
	} catch (err) {
		return null
	}
}

export default { encode, decode }
