import ORM, { User } from '@/ORM'
import { EntityData, wrap } from '@mikro-orm/core'
import Joi from 'joi'
import { Context } from 'koa'

const idSchema = Joi.string().pattern(/\w+$/)
const schema = Joi.object({
	id: idSchema.required(),
	password: Joi.string().required(),
	isAdministrator: Joi.boolean().default(false),
	student: idSchema.allow(null).default(null),
	teacher: idSchema.allow(null).default(null)
})
const batchSchema = Joi.array().items(schema)

/** 单个用户 PUT 请求 */
export async function single(ctx: Context) {
	const body: EntityData<User> = await schema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(User)
	let user = await repo.findOne(ctx.params.userID)
	if (user === null) {
		user = repo.create(body)
		repo.persist(user)
	} else
		wrap(user).assign(body)
	await repo.flush()
	ctx.body = wrap(user).toObject()
}

/** 用户批量 PUT 请求 */
export async function batch(ctx: Context) {
	const body: EntityData<User>[] = await batchSchema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(User)
	const users = await repo.find(body.map((data) => data.id))
	const userIDs = users.map((user) => user.id)
	body.forEach((data) => {
		let user = users[userIDs.indexOf(data.id)]
		if (user === undefined) {
			user = repo.create(data)
			repo.persist(user)
			users.push(user)
			userIDs.push(user.id)
		} else
			wrap(user).assign(data)
	})
	await repo.flush()
	ctx.body = users.map((user) => wrap(user).toObject())
}
