import { Context, Next } from 'koa'

/** 过滤器：仅管理员可操作 */
export async function administratorOnlyFilter(ctx: Context, next: Next) {
	if (ctx.state.authorization.isAdministrator)
		await next()
	else
		ctx.throw(403)
}

/** 过滤器：资源用户自身和管理员可操作 */
export async function selfAndAdministratorFilter(ctx: Context, next: Next) {
	if (ctx.state.authorization.isAdministrator || ctx.state.authorization.username === ctx.params.username)
		await next()
	else
		ctx.throw(403)
}
