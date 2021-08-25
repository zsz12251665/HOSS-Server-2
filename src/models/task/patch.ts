import ORM, { Task, User } from '@/ORM'
import { EntityData, Primary, wrap } from '@mikro-orm/core'
import Joi from 'joi'
import { Context } from 'koa'

const idSchema = Joi.string().pattern(/\w+$/)
const schema = Joi.object({
	id: idSchema.optional(),
	title: Joi.string().optional(),
	deadline: Joi.date().allow(null).optional(),
	description: Joi.string().optional(),
	pattern: Joi.string().optional()
})
const batchSchema = Joi.array().items(Joi.array().ordered(idSchema, schema))
const setSchema = Joi.object({
	insert: Joi.array().items(idSchema).optional(),
	delete: Joi.array().items(idSchema).optional()
})

const trim = (obj: { [key: string]: any }) => Object.keys(obj).filter((key) => obj[key] === undefined).forEach((key) => delete obj[key])

/** 单个任务 PATCH 请求 */
export async function single(ctx: Context) {
	const body: EntityData<Task> = await schema.validateAsync(ctx.request.body)
	trim(body)
	const repo = ORM.em.getRepository(Task)
	const task = await repo.findOne([ctx.params.courseID, ctx.params.taskID])
	if (task === null)
		ctx.throw(404)
	wrap(task).assign(body)
	await repo.flush()
	ctx.body = wrap(task).toObject()
}

/** 任务批量 PATCH 请求 */
export async function batch(ctx: Context) {
	const body: [string, EntityData<Task>][] = await batchSchema.validateAsync(Object.entries(ctx.request.body))
	body.forEach(([_, data]) => trim(data))
	const bodyMap = new Map(body)
	const repo = ORM.em.getRepository(Task)
	const tasks = await repo.find(body.map((entry) => <Primary<Task>>[ctx.params.courseID, entry[0]]))
	if (tasks.length === 0)
		ctx.throw(404, 'No task is found!')
	tasks.forEach((task) => wrap(task).assign(bodyMap.get(task.id)))
	await repo.flush()
	ctx.body = tasks.map((task) => wrap(task).toObject())
}

/** 任务的助教列表 PATCH 请求 */
export async function monitors(ctx: Context) {
	const body: { insert?: string[], delete?: string[] } = await setSchema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Task)
	const task = await repo.findOne([ctx.params.courseID, ctx.params.taskID], ['monitors'])
	if (task === null)
		ctx.throw(404)
	const userRepo = ORM.em.getRepository(User)
	if (body.insert !== undefined)
		task.monitors.add(...(await userRepo.find(body.insert)))
	if (body.delete !== undefined)
		task.monitors.remove(...(await userRepo.find(body.delete)))
	await repo.flush()
	ctx.body = task.monitors.getIdentifiers()
}
