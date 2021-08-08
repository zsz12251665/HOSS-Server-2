import { Context } from 'koa'
import { User } from '@/ORM'
import { EntityManager } from '@mikro-orm/core'
import hash from '@/hash'

export default async function registerMiddleware(ctx: Context): Promise<any> {
	const { username, password } = ctx.request.body
	if (!username || !password)
		ctx.throw(400, 'The username and password should not be empty!')
	const em: EntityManager = ctx.em
	const user = await em.findOne(User, { identification: username })
	if (user)
		ctx.throw(403, 'The username has been taken!')
	else {
		await em.persistAndFlush(em.create(User, { identification: username, certificate: hash(password) }))
		ctx.status = 201
		ctx.body = `/users/${username}`
	}
}
