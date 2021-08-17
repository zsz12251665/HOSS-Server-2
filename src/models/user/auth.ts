import { Context, Middleware, Next } from 'koa'

type matchFunction = (ctx: Context) => boolean

/**
 * 过滤器中间件生成器
 * @param {matchFunction} filter 过滤函数
 * @param {string} failedMessage 被过滤时的错误信息
 * @returns {Middleware} 过滤器中间件
 */
function filterGenerator(filter: matchFunction, failedMessage?: string): Middleware {
	return async function (ctx: Context, next: Next) {
		if (filter(ctx))
			await next()
		else
			if (failedMessage === undefined)
				ctx.throw(403)
			else
				ctx.throw(403, failedMessage)
	}
}

const administratorChecker: matchFunction = (ctx) => ctx.state.authorization.isAdministrator
const selfChecker: matchFunction = (ctx) => ctx.state.authorization.username === ctx.params.username

/** 过滤器：仅管理员可操作 */
export const administratorOnly = filterGenerator(administratorChecker)

/** 过滤器：仅资源用户自身可操作 */
export const selfOnly = filterGenerator(selfChecker)

/** 过滤器：资源用户自身和管理员可操作 */
export const selfOrAdministrator = filterGenerator((ctx) => administratorChecker(ctx) || selfChecker(ctx))
