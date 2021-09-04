import ORM, { Course, Student } from '@/ORM'
import { EntityData, wrap } from '@mikro-orm/core'
import Joi from 'joi'
import { RouterContext } from '@koa/router'

const idSchema = Joi.string().pattern(/\w+$/)
const schema = Joi.object({
	id: idSchema.optional(),
	name: Joi.string().optional(),
	class: Joi.string().optional(),
	user: idSchema.allow(null).optional()
})
const batchSchema = Joi.array().items(Joi.array().ordered(idSchema, schema))
const setSchema = Joi.object({
	insert: Joi.array().items(idSchema).optional(),
	delete: Joi.array().items(idSchema).optional()
})

/** 单个学生 PATCH 请求 */
export async function single(ctx: RouterContext) {
	const body: EntityData<Student> = await schema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Student)
	const student = await repo.findOne(ctx.params.studentID)
	if (student === null)
		ctx.throw(404)
	wrap(student).assign(body)
	await repo.flush()
	ctx.body = wrap(student).toObject()
}

/** 学生批量 PATCH 请求 */
export async function batch(ctx: RouterContext) {
	const body: [string, EntityData<Student>][] = await batchSchema.validateAsync(Object.entries(ctx.request.body))
	const bodyMap = new Map(body)
	const repo = ORM.em.getRepository(Student)
	const students = await repo.find(body.map((entry) => entry[0]))
	if (students.length === 0)
		ctx.throw(404, 'No student is found!')
	students.forEach((student) => wrap(student).assign(bodyMap.get(student.id)))
	await repo.flush()
	ctx.body = students.map((student) => wrap(student).toObject())
}

/** 学生的课程列表 PATCH 请求 */
export async function courses(ctx: RouterContext) {
	const body: { insert?: string[], delete?: string[] } = await setSchema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Student)
	const student = await repo.findOne(ctx.params.studentID, ['courses'])
	if (student === null)
		ctx.throw(404)
	const courseRepo = ORM.em.getRepository(Course)
	if (body.insert !== undefined)
		student.courses.add(...(await courseRepo.find(body.insert)))
	if (body.delete !== undefined)
		student.courses.remove(...(await courseRepo.find(body.delete)))
	await repo.flush()
	ctx.body = student.courses.getIdentifiers()
}
