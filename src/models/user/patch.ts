import hash from '@/hash'
import ORM, { User } from '@/ORM'
import { wrap } from '@mikro-orm/core'
import Joi from 'joi'
import { Context } from 'koa'

const schema = Joi.object({
	username: Joi.string().pattern(/\w+$/).optional(),
	password: Joi.string().optional(),
	isAdministrator: Joi.boolean().optional(),
	studentNumber: Joi.string().pattern(/\w+$/).allow(null).optional(),
	teacherID: Joi.number().integer().min(0).allow(null).optional()
})

const batchSchema = Joi.array().items(Joi.array().ordered(Joi.string(), schema))

interface IUser {
	identification?: string
	certificate?: string
	isAdministrator?: boolean
	student?: string | null
	teacher?: number | null
}

function unserialize(body: any, isAdministrator: boolean = true): IUser {
	const user: IUser = {}
	if (body.username !== undefined)
		user.identification = body.username
	if (body.password !== undefined)
		user.certificate = hash(body.password)
	if (isAdministrator) {
		if (body.isAdministrator !== undefined)
			user.isAdministrator = body.isAdministrator
		if (body.studentNumber !== undefined)
			user.student = body.studentNumber
		if (body.teacherID !== undefined)
			user.teacher = body.teacherID
	}
	return user
}

/** 单个用户 PATCH 请求 */
export async function single(ctx: Context) {
	const body = await schema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(User)
	const user = await repo.findOne(ctx.params.username)
	if (user === null)
		ctx.throw(404)
	wrap(user).assign(unserialize(body, ctx.state.authorization.isAdministrator))
	await repo.flush()
	ctx.body = wrap(user).toObject()
}

/** 用户批量 PATCH 请求 */
export async function batch(ctx: Context) {
	const body: [any, any][] = await batchSchema.validateAsync(Object.entries(ctx.request.body))
	const bodyMap = new Map(body)
	const repo = ORM.em.getRepository(User)
	const users = await repo.find(body.map((entry) => entry[0]))
	if (users.length === 0)
		ctx.throw(404, 'No user is found!')
	users.forEach((user) => wrap(user).assign(unserialize(bodyMap.get(user.identification))))
	await repo.flush()
	ctx.body = users.map((user) => wrap(user).toObject())
}
