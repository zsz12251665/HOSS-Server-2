import ORM, { Course } from '@/ORM'
import { EntityData, wrap } from '@mikro-orm/core'
import Joi from 'joi'
import { Context } from 'koa'

const idSchema = Joi.string().pattern(/\w+$/)
const schema = Joi.object({
	id: idSchema.required(),
	name: Joi.string().required(),
})
const batchSchema = Joi.array().items(schema)
const setSchema = Joi.array().items(idSchema)

/** 单个课程 PUT 请求 */
export async function single(ctx: Context) {
	const body: EntityData<Course> = await schema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Course)
	let course = await repo.findOne(ctx.params.courseID)
	if (course === null) {
		course = repo.create(body)
		repo.persist(course)
	} else
		wrap(course).assign(body)
	await repo.flush()
	ctx.body = wrap(course).toObject()
}

/** 课程批量 PUT 请求 */
export async function batch(ctx: Context) {
	const body: EntityData<Course>[] = await batchSchema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Course)
	const courses = await repo.find(body.map((data) => data.id))
	const courseIDs = courses.map((course) => course.id)
	body.forEach((data) => {
		let course = courses[courseIDs.indexOf(data.id)]
		if (course === undefined) {
			course = repo.create(data)
			repo.persist(course)
			courses.push(course)
			courseIDs.push(course.id)
		} else
			wrap(course).assign(data)
	})
	await repo.flush()
	ctx.body = courses.map((course) => wrap(course).toObject())
}

/** 课程的学生列表 PUT 请求 */
export async function students(ctx: Context) {
	const body: string[] = await setSchema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Course)
	const course = await repo.findOne(ctx.params.courseID, ['students'])
	if (course === null)
		ctx.throw(404)
	wrap(course).assign({ students: body })
	await repo.flush()
	ctx.body = course.students.getIdentifiers()
}

/** 课程的教师列表 PUT 请求 */
export async function teachers(ctx: Context) {
	const body: string[] = await setSchema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Course)
	const course = await repo.findOne(ctx.params.courseID, ['teachers'])
	if (course === null)
		ctx.throw(404)
	wrap(course).assign({ teachers: body })
	await repo.flush()
	ctx.body = course.teachers.getIdentifiers()
}
