import hash from '@/hash'
import ORM, { User } from '@/ORM'
import { EntityData, wrap } from '@mikro-orm/core'
import Joi from 'joi'
import { Context } from 'koa'

const schema = Joi.object({
	username: Joi.string().pattern(/\w+$/).required(),
	password: Joi.string().required(),
	isAdministrator: Joi.boolean().default(false),
	studentNumber: Joi.string().pattern(/\w+$/).allow(null).default(null),
	teacherID: Joi.number().integer().min(0).allow(null).default(null)
})

const batchSchema = Joi.array().items(Joi.array().ordered(Joi.string(), schema))

const unserialize = (body: any): EntityData<User> => ({
	identification: body.username,
	certificate: hash(body.password),
	isAdministrator: body.isAdministrator ?? false,
	student: body.studentNumber ?? null,
	teacher: body.teacherID ?? null
})

/** 单个用户 PUT 请求 */
export async function single(ctx: Context) {
	const body = await schema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(User)
	let user = await repo.findOne(ctx.params.username)
	if (user === null) {
		user = repo.create(unserialize(body))
		repo.persist(user)
	} else
		wrap(user).assign(unserialize(body))
	await repo.flush()
	ctx.body = wrap(user).toObject()
}

/** 用户批量 PUT 请求 */
export async function batch(ctx: Context) {
	const body: [any, any][] = await batchSchema.validateAsync(Object.entries(ctx.request.body))
	const repo = ORM.em.getRepository(User)
	const users = await repo.find(body.map((entry) => entry[0]))
	const usernames = users.map((user) => user.identification)
	body.forEach(([username, data]) => {
		let user = users[usernames.indexOf(username)]
		if (user === undefined) {
			user = repo.create(unserialize(data))
			repo.persist(user)
			users.push(user)
			usernames.push(username)
		} else
			wrap(user).assign(unserialize(data))
	})
	await repo.flush()
	ctx.body = users.map((user) => wrap(user).toObject())
}
