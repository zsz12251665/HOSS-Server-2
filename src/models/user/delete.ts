import ORM, { User } from '@/ORM'
import { Context } from 'koa'

/** 单个用户 DELETE 请求 */
export async function single(ctx: Context) {
	const repo = ORM.em.getRepository(User)
	const user = await repo.findOne(ctx.params.username)
	if (user === null)
		ctx.throw(404)
	await repo.removeAndFlush(user)
	ctx.body = null
}

/** 用户批量 DELETE 请求 */
export async function batch(ctx: Context) {
	const repo = ORM.em.getRepository(User)
	const users = await repo.find(ctx.request.body)
	if (users.length === 0)
		ctx.throw(404, 'No user is found!')
	await repo.removeAndFlush(users)
	ctx.body = users.map((user) => user.identification)
}
