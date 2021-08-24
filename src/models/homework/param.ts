import ORM, { Task } from '@/ORM'
import { Context, Next } from 'koa'

export default async function paramValidator(ctx: Context, next: Next) {
	const task = await ORM.em.getRepository(Task).findOne([ctx.params.courseID, ctx.params.taskID])
	if (task === null)
		ctx.throw(404)
	ctx.state.task = task
	await next()
}
