import ORM, { Course, Student, Teacher } from '@/ORM'
import { EntityData, wrap } from '@mikro-orm/core'
import Joi from 'joi'
import { RouterContext } from '@koa/router'

const idSchema = Joi.string().pattern(/\w+$/)
const schema = Joi.object({
	id: idSchema.optional(),
	name: Joi.string().optional(),
})
const batchSchema = Joi.array().items(Joi.array().ordered(idSchema, schema))
const setSchema = Joi.object({
	insert: Joi.array().items(idSchema).optional(),
	delete: Joi.array().items(idSchema).optional()
})

/** 单个课程 PATCH 请求 */
export async function single(ctx: RouterContext) {
	const body: EntityData<Course> = await schema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Course)
	const course = await repo.findOne(ctx.params.courseID)
	if (course === null)
		ctx.throw(404)
	wrap(course).assign(body)
	await repo.flush()
	ctx.body = wrap(course).toObject()
}

/** 课程批量 PATCH 请求 */
export async function batch(ctx: RouterContext) {
	const body: [string, EntityData<Course>][] = await batchSchema.validateAsync(Object.entries(ctx.request.body))
	const bodyMap = new Map(body)
	const repo = ORM.em.getRepository(Course)
	const courses = await repo.find(body.map((entry) => entry[0]))
	if (courses.length === 0)
		ctx.throw(404, 'No course is found!')
	courses.forEach((course) => wrap(course).assign(bodyMap.get(course.id)))
	await repo.flush()
	ctx.body = courses.map((course) => wrap(course).toObject())
}

/** 课程的学生列表 PATCH 请求 */
export async function students(ctx: RouterContext) {
	const body: { insert?: string[], delete?: string[] } = await setSchema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Course)
	const course = await repo.findOne(ctx.params.courseID, ['students'])
	if (course === null)
		ctx.throw(404)
	const studentRepo = ORM.em.getRepository(Student)
	if (body.insert !== undefined)
		course.students.add(...(await studentRepo.find(body.insert)))
	if (body.delete !== undefined)
		course.students.remove(...(await studentRepo.find(body.delete)))
	await repo.flush()
	ctx.body = course.students.getIdentifiers()
}

/** 课程的教师列表 PATCH 请求 */
export async function teachers(ctx: RouterContext) {
	const body: { insert?: string[], delete?: string[] } = await setSchema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Course)
	const course = await repo.findOne(ctx.params.courseID, ['teachers'])
	if (course === null)
		ctx.throw(404)
	const teacherRepo = ORM.em.getRepository(Teacher)
	if (body.insert !== undefined)
		course.teachers.add(...(await teacherRepo.find(body.insert)))
	if (body.delete !== undefined)
		course.teachers.remove(...(await teacherRepo.find(body.delete)))
	await repo.flush()
	ctx.body = course.teachers.getIdentifiers()
}
