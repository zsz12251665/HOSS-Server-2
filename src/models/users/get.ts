import { User } from '@/ORM'
import { EntityManager } from '@mikro-orm/core'
import { Context } from 'koa'

export async function getUserSingleMiddleware(ctx: Context) {
	const { username } = ctx.params
	const authorization = ctx.state.authorization.username
	const em: EntityManager = ctx.em
	if (authorization !== username) {
		const user = await em.findOne(User, authorization)
		if (user === null || !user.isAdministrator)
			ctx.throw(403)
	}
	const user = await em.findOne(User, username)
	if (user === null)
		ctx.throw(404)
	else
		ctx.body = {
			username: user.identification,
			isAdministrator: user.isAdministrator,
			studentNumber: user.student?.number ?? null,
			teacherID: user.teacher?.id ?? null
		}
}

export async function getUserMultipleMiddleware(ctx: Context) {
	const { username } = ctx.params
	const authorization = ctx.state.authorization.username
	const em: EntityManager = ctx.em
	const user = await em.findOne(User, authorization)
	if (user === null || !user.isAdministrator)
		ctx.throw(403)
	const users = await em.find(User, {})
	ctx.body = users.map((user: User) => ({
		username: user.identification,
		isAdministrator: user.isAdministrator,
		studentNumber: user.student?.number ?? null,
		teacherID: user.teacher?.id ?? null
	}))
}
