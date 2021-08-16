import hash from '@/hash'
import { encode } from '@/JWT'
import ORM, { User } from '@/ORM'
import { Rules, validate } from '@/parameter'
import { Context } from 'koa'

/** 登录请求 */
export async function login(ctx: Context) {
	const rules: Rules = {
		username: 'string',
		password: 'password',
		tokenType: 'string?'
	}
	validate(rules, ctx.request.body, (errors) => ctx.throw(400, JSON.stringify(errors)))
	const { username, password, tokenType } = ctx.request.body
	if (ctx.params.username !== undefined && ctx.params.username !== username)
		ctx.throw(400, 'The username does not match!')
	const repo = ORM.em.getRepository(User)
	const user = await repo.findOne(username)
	if (user !== null && user.certificate === hash(password)) {
		ctx.status = 200
		ctx.body = encode({ username, isAdministrator: user.isAdministrator, tokenType }, tokenType ?? 'userToken')
	} else
		ctx.throw(403, 'The username or password is incorrect!')
}

/** 注册请求 */
export async function register(ctx: Context) {
	const rules: Rules = {
		username: 'string',
		password: 'password'
	}
	validate(rules, ctx.request.body, (errors) => ctx.throw(400, JSON.stringify(errors)))
	const { username, password } = ctx.request.body
	const repo = ORM.em.getRepository(User)
	const user = await repo.findOne(username)
	if (user !== null)
		ctx.throw(403, 'The username has been taken!')
	else {
		await repo.persistAndFlush(repo.create({ identification: username, certificate: hash(password) }))
		ctx.status = 201
		ctx.body = `User ${username} has been created!`
	}
}
