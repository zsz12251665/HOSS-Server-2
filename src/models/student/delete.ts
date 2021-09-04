import ORM, { Student } from '@/ORM'
import { RouterContext } from '@koa/router'

/** 单个学生 DELETE 请求 */
export async function single(ctx: RouterContext) {
	const repo = ORM.em.getRepository(Student)
	const student = await repo.findOne(ctx.params.studentID)
	if (student === null)
		ctx.throw(404)
	await repo.removeAndFlush(student)
	ctx.body = null
}
