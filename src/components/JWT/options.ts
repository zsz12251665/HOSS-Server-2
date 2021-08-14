import { SignOptions } from "jsonwebtoken"

const options = new Map<string, SignOptions>([
	['default', { algorithm: 'HS256', expiresIn: '15min' }],
	['userToken', { algorithm: 'HS256', expiresIn: '2h' }],
	['refreshToken', { algorithm: 'HS256', expiresIn: '7d' }]
])

export default options
