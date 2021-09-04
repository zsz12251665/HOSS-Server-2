import ORM, { Task, User } from '@/ORM'
import { wrap } from '@mikro-orm/core'
import { RouterContext } from '@koa/router'

/** 单个任务 GET 请求 */
export async function single(ctx: RouterContext) {
	const repo = ORM.em.getRepository(Task)
	const task = await repo.findOne([ctx.params.courseID, ctx.params.taskID])
	if (task === null)
		ctx.throw(404)
	ctx.body = wrap(task).toObject()
}

/** 任务批量 GET 请求 */
export async function batch(ctx: RouterContext) {
	if (ctx.state.isRelatedStudent || ctx.state.isRelatedTeacher) {
		const repo = ORM.em.getRepository(Task)
		const tasks = await repo.find({ course: ctx.params.courseID })
		ctx.body = tasks.map((task) => wrap(task).toObject())
	} else {
		/** @see {@link ./auth.ts:24} */
		const user: User = ctx.state.authorization.user
		ctx.body = user.tasks.getItems().filter((task) => task.course.id === ctx.params.courseID).map((task) => wrap(task).toObject())
	}
}

/** 任务的助教列表 GET 请求 */
export async function monitors(ctx: RouterContext) {
	const repo = ORM.em.getRepository(Task)
	const task = await repo.findOne([ctx.params.courseID, ctx.params.taskID], ['monitors'])
	if (task === null)
		ctx.throw(404)
	ctx.body = task.monitors.getIdentifiers()
}
