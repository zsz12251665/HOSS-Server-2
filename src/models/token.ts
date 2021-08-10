import { decode } from '@/JWT'
import { Context, Next } from 'koa'

export default async function tokenMiddleware(ctx: Context, next: Next) {
	const token = <string>ctx.headers.token
	if (token === undefined)
		ctx.throw(401, 'No authorization token is provided!')
	const payload = decode(token)
	if (payload === null)
		ctx.throw(401, 'Invalid authorization token!')
	ctx.state.authorization = payload
	await next()
}
