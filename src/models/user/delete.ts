import ORM, { User } from '@/ORM'
import { Context } from 'koa'

/** 单个用户 DELETE 请求 */
export async function single(ctx: Context) {
	const repo = ORM.em.getRepository(User)
	const user = await repo.findOne(ctx.params.userID)
	if (user === null)
		ctx.throw(404)
	await repo.removeAndFlush(user)
	ctx.body = null
}
