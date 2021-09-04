import ORM, { User } from '@/ORM'
import { wrap } from '@mikro-orm/core'
import { Context } from 'koa'

/** 单个用户 GET 请求 */
export async function single(ctx: Context) {
	const repo = ORM.em.getRepository(User)
	const user = await repo.findOne(ctx.params.userID)
	if (user === null)
		ctx.throw(404)
	ctx.body = wrap(user).toObject()
}

/** 用户批量 GET 请求 */
export async function batch(ctx: Context) {
	const repo = ORM.em.getRepository(User)
	const users = await repo.findAll()
	ctx.body = users.map((user) => wrap(user).toObject())
}

/** 用户管理的任务列表 GET 请求 */
export async function tasks(ctx: Context) {
	const repo = ORM.em.getRepository(User)
	const user = await repo.findOne(ctx.params.userID, ['tasks'])
	if (user === null)
		ctx.throw(404)
	ctx.body = user.tasks.getItems().map((task) => wrap(task).toObject())
}
