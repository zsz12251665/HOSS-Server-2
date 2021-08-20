import ORM, { Course, Teacher } from '@/ORM'
import { EntityData, wrap } from '@mikro-orm/core'
import Joi from 'joi'
import { Context } from 'koa'

const schema = Joi.object({
	id: Joi.number().integer().min(0).optional(),
	name: Joi.string().optional(),
	username: Joi.string().pattern(/\w+$/).allow(null).optional()
})

const batchSchema = Joi.array().items(Joi.array().ordered(Joi.number().integer().min(0), schema))

const coursesSchema = Joi.object({
	insert: Joi.array().items(Joi.number().integer().min(0)).optional(),
	delete: Joi.array().items(Joi.number().integer().min(0)).optional()
})

function unserialize(body: any): EntityData<Teacher> {
	const teacher: EntityData<Teacher> = {}
	if (body.id !== undefined)
		teacher.id = body.id
	if (body.name !== undefined)
		teacher.name = body.name
	if (body.username !== undefined)
		teacher.user = body.username
	return teacher
}

/** 单个教师 PATCH 请求 */
export async function single(ctx: Context) {
	const body = await coursesSchema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Teacher)
	const teacher = await repo.findOne(ctx.params.teacherID)
	if (teacher === null)
		ctx.throw(404)
	wrap(teacher).assign(unserialize(body))
	await repo.flush()
	ctx.body = wrap(teacher).toObject()
}

/** 教师批量 PATCH 请求 */
export async function batch(ctx: Context) {
	const body: [any, any][] = await batchSchema.validateAsync(Object.entries(ctx.request.body))
	const bodyMap = new Map(body)
	const repo = ORM.em.getRepository(Teacher)
	const teachers = await repo.find(body.map((entry) => entry[0]))
	if (teachers.length === 0)
		ctx.throw(404, 'No teacher is found!')
	teachers.forEach((teacher) => wrap(teacher).assign(unserialize(bodyMap.get(teacher.id))))
	await repo.flush()
	ctx.body = teachers.map((teacher) => wrap(teacher).toObject())
}

/** 修改教师的课程列表（增加/移除） */
export async function courses(ctx: Context) {
	const body = await coursesSchema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Teacher)
	const teacher = await repo.findOne(ctx.params.teacherID, ['courses'])
	if (teacher === null)
		ctx.throw(404)
	const courseRepo = ORM.em.getRepository(Course)
	teacher.courses.add(...(await courseRepo.find(body.insert)))
	teacher.courses.remove(...(await courseRepo.find(body.delete)))
	await repo.flush()
	ctx.body = teacher.courses.getIdentifiers()
}
