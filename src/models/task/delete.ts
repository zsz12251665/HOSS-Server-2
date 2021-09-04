import ORM, { Task } from '@/ORM'
import { RouterContext } from '@koa/router'

/** 单个任务 DELETE 请求 */
export async function single(ctx: RouterContext) {
	const repo = ORM.em.getRepository(Task)
	const task = await repo.findOne([ctx.params.courseID, ctx.params.taskID])
	if (task === null)
		ctx.throw(404)
	await repo.removeAndFlush(task)
	ctx.body = null
}
