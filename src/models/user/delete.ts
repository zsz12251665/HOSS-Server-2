import { User } from '@/ORM'
import { EntityManager } from '@mikro-orm/core'
import { Context } from 'koa'

export async function deleteSingle(ctx: Context) {
	const em: EntityManager = ctx.em
	const user = await em.findOne(User, ctx.params.username)
	if (user === null)
		ctx.throw(404)
	else {
		await em.removeAndFlush(user)
		ctx.body = null
	}
}

export async function deleteMultiple(ctx: Context) {
	const em: EntityManager = ctx.em
	const body = ctx.request.body
	let users: User[]
	if (Array.isArray(body))
		users = (await Promise.all(body.map((username) => em.findOne(User, username)))).filter((user) => user !== null)
	else
		users = await em.find(User, body)
	await em.removeAndFlush(users)
	if (users.length === 0)
		ctx.throw(404, 'No user is deleted!')
	else
		ctx.body = users.map((user: User) => user.identification)
}
