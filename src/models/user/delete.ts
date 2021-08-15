import ORM, { User } from '@/ORM'
import { Context } from 'koa'

/** 单个 DELETE 请求 */
export async function deleteSingle(ctx: Context) {
	const repo = ORM.em.getRepository(User)
	const user = await repo.findOne(ctx.params.username)
	if (user === null)
		ctx.throw(404)
	else {
		await repo.removeAndFlush(user)
		ctx.body = null
	}
}

/** 批量 DELETE 请求 */
export async function deleteMultiple(ctx: Context) {
	const repo = ORM.em.getRepository(User)
	const users = await repo.find(ctx.request.body)
	if (users.length === 0)
		ctx.throw(404, 'No user is found!')
	await repo.removeAndFlush(users)
	ctx.body = users.map((user) => user.identification)
}
