import ORM, { Task } from '@/ORM'
import { EntityData, Primary, wrap } from '@mikro-orm/core'
import Joi from 'joi'
import { RouterContext } from '@koa/router'

const idSchema = Joi.string().pattern(/\w+$/)
const schema = Joi.object({
	id: idSchema.required(),
	title: Joi.string().required(),
	deadline: Joi.date().allow(null).default(null),
	description: Joi.string().default(''),
	pattern: Joi.string().default(':name:-:id:')
})
const batchSchema = Joi.array().items(schema)
const setSchema = Joi.array().items(idSchema)

/** 单个任务 PUT 请求 */
export async function single(ctx: RouterContext) {
	const body: EntityData<Task> = await schema.validateAsync(ctx.request.body)
	body.course = ctx.params.courseID
	const repo = ORM.em.getRepository(Task)
	let task = await repo.findOne([ctx.params.courseID, ctx.params.taskID])
	if (task === null) {
		task = repo.create(body)
		repo.persist(task)
	} else
		wrap(task).assign(body)
	await repo.flush()
	ctx.body = wrap(task).toObject()
}

/** 任务批量 PUT 请求 */
export async function batch(ctx: RouterContext) {
	const body: EntityData<Task>[] = await batchSchema.validateAsync(ctx.request.body)
	body.forEach((data) => data.course = ctx.params.courseID)
	const repo = ORM.em.getRepository(Task)
	const tasks = await repo.find(body.map((data) => <Primary<Task>>[data.course, data.id]))
	const taskIDs = tasks.map((task) => task.id)
	body.forEach((data) => {
		let task = tasks[taskIDs.indexOf(data.id)]
		if (task === undefined) {
			task = repo.create(data)
			repo.persist(task)
			tasks.push(task)
			taskIDs.push(task.id)
		} else
			wrap(task).assign(data)
	})
	await repo.flush()
	ctx.body = tasks.map((task) => wrap(task).toObject())
}

/** 任务的助教列表 PUT 请求 */
export async function monitors(ctx: RouterContext) {
	const body: string[] = await setSchema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Task)
	const task = await repo.findOne([ctx.params.courseID, ctx.params.taskID], ['monitors'])
	if (task === null)
		ctx.throw(404)
	wrap(task).assign({ monitors: body })
	await repo.flush()
	ctx.body = task.monitors.getIdentifiers()
}
