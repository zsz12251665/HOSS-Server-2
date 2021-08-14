import { User } from '@/ORM'
import { EntityManager } from '@mikro-orm/core'
import { Context, Next } from 'koa'

export async function administratorOnlyFilter(ctx: Context, next: Next) {
	const authorization = ctx.state.authorization.username
	const em: EntityManager = ctx.em
	const user = await em.findOne(User, authorization)
	if (user === null || !user.isAdministrator)
		ctx.throw(403)
	await next()
}

export async function selfAndAdministratorFilter(ctx: Context, next: Next) {
	const authorization = ctx.state.authorization.username
	if (authorization !== ctx.params.username) {
		const em: EntityManager = ctx.em
		const user = await em.findOne(User, authorization)
		if (user === null || !user.isAdministrator)
			ctx.throw(403)
	}
	await next()
}
