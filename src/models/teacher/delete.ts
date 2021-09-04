import ORM, { Teacher } from '@/ORM'
import { RouterContext } from '@koa/router'

/** 单个教师 DELETE 请求 */
export async function single(ctx: RouterContext) {
	const repo = ORM.em.getRepository(Teacher)
	const teacher = await repo.findOne(ctx.params.teacherID)
	if (teacher === null)
		ctx.throw(404)
	await repo.removeAndFlush(teacher)
	ctx.body = null
}
