import { User } from '@/ORM'
import { EntityManager } from '@mikro-orm/core'
import { Context } from 'koa'

const userMapper = (user: User) => ({
	username: user.identification,
	isAdministrator: user.isAdministrator,
	studentNumber: user.student?.number ?? null,
	teacherID: user.teacher?.id ?? null
})

export async function getSingle(ctx: Context) {
	const em: EntityManager = ctx.em
	const user = await em.findOne(User, ctx.params.username)
	if (user === null)
		ctx.throw(404)
	else
		ctx.body = userMapper(user)
}

export async function getMultiple(ctx: Context) {
	const em: EntityManager = ctx.em
	const users = await em.find(User, {})
	ctx.body = users.map(userMapper)
}
