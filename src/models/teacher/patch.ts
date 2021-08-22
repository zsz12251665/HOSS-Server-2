import ORM, { Course, Teacher } from '@/ORM'
import { EntityData, wrap } from '@mikro-orm/core'
import Joi from 'joi'
import { Context } from 'koa'

const idSchema = Joi.string().pattern(/\w+$/)
const schema = Joi.object({
	id: idSchema.optional(),
	name: Joi.string().optional(),
	user: idSchema.allow(null).optional()
})
const batchSchema = Joi.array().items(Joi.array().ordered(idSchema, schema))
const setSchema = Joi.object({
	insert: Joi.array().items(idSchema).optional(),
	delete: Joi.array().items(idSchema).optional()
})

const trim = (obj: { [key: string]: any }) => Object.keys(obj).filter((key) => obj[key] === undefined).forEach((key) => delete obj[key])

/** 单个教师 PATCH 请求 */
export async function single(ctx: Context) {
	const body: EntityData<Teacher> = await schema.validateAsync(ctx.request.body)
	trim(body)
	const repo = ORM.em.getRepository(Teacher)
	const teacher = await repo.findOne(ctx.params.teacherID)
	if (teacher === null)
		ctx.throw(404)
	wrap(teacher).assign(body)
	await repo.flush()
	ctx.body = wrap(teacher).toObject()
}

/** 教师批量 PATCH 请求 */
export async function batch(ctx: Context) {
	const body: [string, EntityData<Teacher>][] = await batchSchema.validateAsync(Object.entries(ctx.request.body))
	body.forEach(([_, data]) => trim(data))
	const bodyMap = new Map(body)
	const repo = ORM.em.getRepository(Teacher)
	const teachers = await repo.find(body.map((entry) => entry[0]))
	if (teachers.length === 0)
		ctx.throw(404, 'No teacher is found!')
	teachers.forEach((teacher) => wrap(teacher).assign(bodyMap.get(teacher.id)))
	await repo.flush()
	ctx.body = teachers.map((teacher) => wrap(teacher).toObject())
}

/** 教师的课程列表 PATCH 请求 */
export async function courses(ctx: Context) {
	const body: { insert?: string[], delete?: string[] } = await setSchema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Teacher)
	const teacher = await repo.findOne(ctx.params.teacherID, ['courses'])
	if (teacher === null)
		ctx.throw(404)
	const courseRepo = ORM.em.getRepository(Course)
	if (body.insert !== undefined)
		teacher.courses.add(...(await courseRepo.find(body.insert)))
	if (body.delete !== undefined)
		teacher.courses.remove(...(await courseRepo.find(body.delete)))
	await repo.flush()
	ctx.body = teacher.courses.getIdentifiers()
}
