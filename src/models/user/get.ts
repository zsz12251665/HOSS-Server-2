import ORM, { User } from '@/ORM'
import { wrap } from '@mikro-orm/core'
import { Context } from 'koa'

/** 单个 GET 请求 */
export async function getSingle(ctx: Context) {
	const repo = ORM.em.getRepository(User)
	const user = await repo.findOne(ctx.params.username)
	if (user === null)
		ctx.throw(404)
	else
		ctx.body = wrap(user).toObject()
}

/** 批量 GET 请求 */
export async function getMultiple(ctx: Context) {
	const repo = ORM.em.getRepository(User)
	const users = await repo.findAll()
	ctx.body = users.map((user) => wrap(user).toObject())
}
