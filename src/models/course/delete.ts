import ORM, { Course } from '@/ORM'
import { RouterContext } from '@koa/router'

/** 单个课程 DELETE 请求 */
export async function single(ctx: RouterContext) {
	const repo = ORM.em.getRepository(Course)
	const course = await repo.findOne(ctx.params.courseID)
	if (course === null)
		ctx.throw(404)
	await repo.removeAndFlush(course)
	ctx.body = null
}
