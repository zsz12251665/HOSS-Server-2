import { decode } from '@/JWT'
import { Context, Next } from 'koa'

/** 令牌验证中间件 */
export default async function tokenMiddleware(ctx: Context, next: Next) {
	if (ctx.headers.token !== undefined) {
		const payload = decode(<string>ctx.headers.token)
		if (payload === null)
			ctx.throw(401, 'Invalid authorization token!')
		ctx.state.authorization = payload
	}
	await next()
}
