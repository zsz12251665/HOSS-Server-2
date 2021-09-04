import config from '@config/jwt.json'
import { JwtPayload, sign as signJWT, verify } from 'jsonwebtoken'
import options from './options'

/**
 * 签发 JWT 令牌
 * @param {object} content 令牌内容
 * @param {string} optionName 令牌配置名
 * @returns {string} JWT 令牌
 */
export function sign(content: object, optionName: string = 'default'): string {
	return signJWT(content, config.secret, Object.assign({ issuer: config.issuer }, options.get(options.has(optionName) ? optionName : 'default')))
}

/**
 * 解析 JWT 令牌
 * @param {string} token JWT 令牌
 * @returns {JwtPayload} 令牌内容
 * @throws {JsonWebTokenError} JWT 错误
 */
export function interpret(token: string): JwtPayload {
	return <JwtPayload>verify(token, config.secret, { issuer: config.issuer })
}
