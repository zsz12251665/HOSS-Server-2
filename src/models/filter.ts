import { Context, Middleware, Next } from 'koa'

export type matchFunction = (ctx: Context) => Promise<boolean | string>

/**
 * 过滤器中间件生成器
 * @param {matchFunction} filter 过滤函数
 * @returns {Middleware} 过滤器中间件
 */
export function filterMiddleware(filter: matchFunction): Middleware {
	return async function (ctx: Context, next: Next) {
		if (ctx.headers.token === undefined)
			ctx.throw(401, 'No authorization token is provided!')
		const result = await filter(ctx)
		if (typeof result === 'string')
			ctx.throw(403, result)
		else
			if (result)
				await next()
			else
				ctx.throw(403)
	}
}
