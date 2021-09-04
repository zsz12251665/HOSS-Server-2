import ORM, { Student } from '@/ORM'
import { EntityData, wrap } from '@mikro-orm/core'
import Joi from 'joi'
import { RouterContext } from '@koa/router'

const idSchema = Joi.string().pattern(/\w+$/)
const schema = Joi.object({
	id: idSchema.required(),
	name: Joi.string().required(),
	class: Joi.string().allow(null).default(null),
	user: idSchema.allow(null).default(null)
})
const batchSchema = Joi.array().items(schema)
const setSchema = Joi.array().items(idSchema)

/** 单个学生 PUT 请求 */
export async function single(ctx: RouterContext) {
	const body: EntityData<Student> = await schema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Student)
	let student = await repo.findOne(ctx.params.studentID)
	if (student === null) {
		student = repo.create(body)
		repo.persist(student)
	} else
		wrap(student).assign(body)
	await repo.flush()
	ctx.body = wrap(student).toObject()
}

/** 学生批量 PUT 请求 */
export async function batch(ctx: RouterContext) {
	const body: EntityData<Student>[] = await batchSchema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Student)
	const students = await repo.find(body.map((data) => data.id))
	const studentIDs = students.map((student) => student.id)
	body.forEach((data) => {
		let student = students[studentIDs.indexOf(data.id)]
		if (student === undefined) {
			student = repo.create(data)
			repo.persist(student)
			students.push(student)
			studentIDs.push(student.id)
		} else
			wrap(student).assign(data)
	})
	await repo.flush()
	ctx.body = students.map((student) => wrap(student).toObject())
}

/** 学生的课程列表 PUT 请求 */
export async function courses(ctx: RouterContext) {
	const body: string[] = await setSchema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Student)
	const student = await repo.findOne(ctx.params.studentID, ['courses'])
	if (student === null)
		ctx.throw(404)
	wrap(student).assign({ courses: body })
	await repo.flush()
	ctx.body = student.courses.getIdentifiers()
}
