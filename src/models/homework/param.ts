import ORM, { Task } from '@/ORM'
import { RouterContext } from '@koa/router'
import { Next } from 'koa'

export default async function paramValidator(ctx: RouterContext, next: Next) {
	const task = await ORM.em.findOne(Task, [ctx.params.courseID, ctx.params.taskID])
	if (task === null)
		ctx.throw(404)
	ctx.state.task = task
	await next()
}
