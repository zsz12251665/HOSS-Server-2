import { User } from '@/ORM'
import { EntityManager } from '@mikro-orm/core'
import { Context, Next } from 'koa'

/** 过滤器：仅管理员可操作 */
export async function administratorOnlyFilter(ctx: Context, next: Next) {
	if (ctx.state.authorization.isAdministrator) // 检查该令牌用户是否为管理员
		await next()
	else
		ctx.throw(403)
}

/** 过滤器：资源用户自身和管理员可操作 */
export async function selfAndAdministratorFilter(ctx: Context, next: Next) {
	const authorization = ctx.state.authorization.username
	const em: EntityManager = ctx.em
	const user = await em.findOne(User, authorization)
	if (user === null) // 检查令牌用户是否存在
		ctx.throw(401, 'The user does not exists!')
	ctx.state.authorization.isAdministrator = user.isAdministrator // 标记该令牌用户是否为管理员
	if (authorization === ctx.params.username || user.isAdministrator)
		await next()
	else
		ctx.throw(403)
}
