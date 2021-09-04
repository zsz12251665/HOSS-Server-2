import { interpret } from '@/JWT'
import { RouterContext, Middleware } from '@koa/router'
import { Next } from 'koa'

/**
 * 过滤函数
 * @param {RouterContext} ctx Koa Router 上下文
 * @returns {boolean} 请求是否通过
 */
export type filterFunction = (ctx: RouterContext) => Promise<boolean>

/**
 * 过滤器中间件生成器
 * @param {filterFunction} filter 过滤函数
 * @returns {Middleware} 过滤器中间件
 */
export function filterMiddleware(filter: filterFunction): Middleware {
	return async function (ctx: RouterContext, next: Next) {
		// Interpret the token
		if (ctx.headers.token === undefined)
			ctx.throw(401, 'No authorization token is provided!')
		if (ctx.state.authorization === undefined)
			ctx.state.authorization = interpret(<string>ctx.headers.token)
		// Apply the filter
		if (await filter(ctx))
			await next()
		else
			ctx.throw(403)
	}
}
