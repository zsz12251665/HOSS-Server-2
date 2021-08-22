import ORM, { User } from '@/ORM'
import { EntityData, wrap } from '@mikro-orm/core'
import Joi from 'joi'
import { Context } from 'koa'

const idSchema = Joi.string().pattern(/\w+$/)
const schema = Joi.object({
	id: idSchema.optional(),
	password: Joi.string().optional(),
	isAdministrator: Joi.boolean().optional(),
	student: idSchema.allow(null).optional(),
	teacher: idSchema.allow(null).optional()
})
const batchSchema = Joi.array().items(Joi.array().ordered(idSchema, schema))

const trim = (obj: { [key: string]: any }) => Object.keys(obj).filter((key) => obj[key] === undefined).forEach((key) => delete obj[key])

/** 单个用户 PATCH 请求 */
export async function single(ctx: Context) {
	const body: EntityData<User> = await schema.validateAsync(ctx.request.body)
	if (!ctx.state.authorization.isAdministrator)
		Object.keys(body).filter((key) => ['id', 'password'].includes(key)).forEach((key) => delete body[key])
	trim(body)
	const repo = ORM.em.getRepository(User)
	const user = await repo.findOne(ctx.params.userID)
	if (user === null)
		ctx.throw(404)
	wrap(user).assign(body)
	await repo.flush()
	ctx.body = wrap(user).toObject()
}

/** 用户批量 PATCH 请求 */
export async function batch(ctx: Context) {
	const body: [string, EntityData<User>][] = await batchSchema.validateAsync(Object.entries(ctx.request.body))
	body.forEach(([_, data]) => trim(data))
	const bodyMap = new Map(body)
	const repo = ORM.em.getRepository(User)
	const users = await repo.find(body.map((entry) => entry[0]))
	if (users.length === 0)
		ctx.throw(404, 'No user is found!')
	users.forEach((user) => wrap(user).assign(bodyMap.get(user.id)))
	await repo.flush()
	ctx.body = users.map((user) => wrap(user).toObject())
}
