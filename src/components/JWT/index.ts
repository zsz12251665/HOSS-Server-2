import config from '@config/jwt.json'
import { JwtPayload, sign, verify } from 'jsonwebtoken'
import options from './options'

/**
 * 使用给定配置签发令牌
 * @param {object} content 要签发的令牌内容
 * @param {string} option 要签发的令牌配置名
 * @returns {string} 签发的令牌内容
 */
export function encode(content: object, option: string = 'default'): string {
	const signOption = Object.assign({ issuer: config.issuer }, options.get(options.has(option) ? option : 'default'))
	return sign(content, config.secret, signOption)
}

/**
 * 解密令牌
 * @param {string} token 签发的令牌内容
 * @returns {JwtPayload | null} 返回 null 时表示令牌失效，否则返回令牌内容
 */
export function decode(token: string): JwtPayload | null {
	try {
		return <JwtPayload>verify(token, config.secret, { issuer: config.issuer })
	} catch (err) {
		return null
	}
}

export default { encode, decode }
