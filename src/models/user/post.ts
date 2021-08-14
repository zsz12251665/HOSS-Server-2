import hash from '@/hash'
import { encode } from '@/JWT'
import { User } from '@/ORM'
import { EntityManager } from '@mikro-orm/core'
import { Context } from 'koa'

export async function login(ctx: Context) {
	const { username, password, tokenType } = ctx.request.body
	if (!username || !password)
		ctx.throw(400, 'The username and password should not be empty!')
	if (ctx.params.username && ctx.params.username !== username)
		ctx.throw(400, 'The username does not match!')
	const em: EntityManager = ctx.em
	const user = await em.findOne(User, {
		identification: username,
		certificate: hash(password)
	})
	if (user) {
		ctx.status = 200
		ctx.body = encode({ username, tokenType }, tokenType ?? 'userToken')
	} else
		ctx.throw(403, 'The username or password is incorrect!')
}

export async function register(ctx: Context) {
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
		ctx.body = `User ${username} has been created!`
	}
}
