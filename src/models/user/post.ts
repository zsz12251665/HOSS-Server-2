import hash from '@/hash'
import { encode } from '@/JWT'
import ORM, { User } from '@/ORM'
import Joi from 'joi'
import { Context } from 'koa'

const loginSchema = Joi.object({
	username: Joi.string().pattern(/\w+$/).required(),
	password: Joi.string().required(),
	tokenType: Joi.string().optional()
})

const registerSchema = Joi.object({
	username: Joi.string().pattern(/\w+$/).required(),
	password: Joi.string().required()
})

/** 用户登录请求 */
export async function login(ctx: Context) {
	const { username, password, tokenType } = await loginSchema.validateAsync(ctx.request.body)
	if (ctx.params.username !== undefined && ctx.params.username !== username)
		ctx.throw(400, 'The username does not match!')
	const repo = ORM.em.getRepository(User)
	const user = await repo.findOne(username)
	if (user !== null && user.certificate === hash(password)) {
		ctx.status = 200
		ctx.body = encode({ username, tokenType }, tokenType ?? 'userToken')
	} else
		ctx.throw(403, 'The username or password is incorrect!')
}

/** 注册用户请求 */
export async function register(ctx: Context) {
	const { username, password } = await registerSchema.validateAsync(ctx.request.body)
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
