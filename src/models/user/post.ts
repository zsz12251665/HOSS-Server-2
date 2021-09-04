import { interpret, sign } from '@/JWT'
import ORM, { User } from '@/ORM'
import { EntityData } from '@mikro-orm/core'
import Joi from 'joi'
import { Context } from 'koa'

const idSchema = Joi.string().pattern(/\w+$/)
const loginSchema = Joi.object({
	id: idSchema.required(),
	password: Joi.string().required(),
	tokenType: Joi.string().optional()
})
const registerSchema = Joi.object({
	id: idSchema.required(),
	password: Joi.string().required(),
	isAdministrator: Joi.boolean().default(false),
	student: idSchema.allow(null).default(null),
	teacher: idSchema.allow(null).default(null)
})

/** 用户登录请求 */
export async function login(ctx: Context) {
	const body: { [key: string]: string } = await loginSchema.validateAsync(ctx.request.body)
	if (ctx.params.userID !== undefined && ctx.params.userID !== body.id)
		ctx.throw(400, 'The id does not match!')
	const repo = ORM.em.getRepository(User)
	const user = await repo.findOne(body.id)
	if (user !== null && user.authenticate(body.password)) {
		ctx.status = 200
		ctx.body = sign({ userID: body.id, tokenType: body.tokenType }, body.tokenType ?? 'userToken')
	} else
		ctx.throw(403, 'The id or password is incorrect!')
}

/** 注册用户请求 */
export async function register(ctx: Context) {
	const body: EntityData<User> = await registerSchema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(User)
	if (ctx.headers.token !== undefined) {
		const { userID } = interpret(<string>ctx.headers.token)
		const user = await repo.findOne(userID)
		if (user === null || !user.isAdministrator)
			Object.keys(body).filter((key) => !['id', 'password'].includes(key)).forEach((key) => delete body[key])
	} else
		Object.keys(body).filter((key) => !['id', 'password'].includes(key)).forEach((key) => delete body[key])
	const user = await repo.findOne(body.id)
	if (user !== null)
		ctx.throw(403, 'The id has been taken!')
	await repo.persistAndFlush(repo.create(body))
	ctx.status = 201
	ctx.set('Location', `/users/${body.id}`)
	ctx.body = `User ${body.id} has been created!`
}
