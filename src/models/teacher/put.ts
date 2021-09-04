import ORM, { Teacher } from '@/ORM'
import { EntityData, wrap } from '@mikro-orm/core'
import Joi from 'joi'
import { RouterContext } from '@koa/router'

const idSchema = Joi.string().pattern(/\w+$/)
const schema = Joi.object({
	id: idSchema.required(),
	name: Joi.string().required(),
	user: idSchema.allow(null).default(null)
})
const batchSchema = Joi.array().items(schema)
const setSchema = Joi.array().items(idSchema)

/** 单个教师 PUT 请求 */
export async function single(ctx: RouterContext) {
	const body: EntityData<Teacher> = await schema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Teacher)
	let teacher = await repo.findOne(ctx.params.teacherID)
	if (teacher === null) {
		teacher = repo.create(body)
		repo.persist(teacher)
	} else
		wrap(teacher).assign(body)
	await repo.flush()
	ctx.body = wrap(teacher).toObject()
}

/** 教师批量 PUT 请求 */
export async function batch(ctx: RouterContext) {
	const body: EntityData<Teacher>[] = await batchSchema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Teacher)
	const teachers = await repo.find(body.map((data) => data.id))
	const teacherIDs = teachers.map((teacher) => teacher.id)
	body.forEach((data) => {
		let teacher = teachers[teacherIDs.indexOf(data.id)]
		if (teacher === undefined) {
			teacher = repo.create(data)
			repo.persist(teacher)
			teachers.push(teacher)
			teacherIDs.push(teacher.id)
		} else
			wrap(teacher).assign(data)
	})
	await repo.flush()
	ctx.body = teachers.map((teacher) => wrap(teacher).toObject())
}

/** 教师的课程列表 PUT 请求 */
export async function courses(ctx: RouterContext) {
	const body: string[] = await setSchema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Teacher)
	const teacher = await repo.findOne(ctx.params.teacherID, ['courses'])
	if (teacher === null)
		ctx.throw(404)
	wrap(teacher).assign({ courses: body })
	await repo.flush()
	ctx.body = teacher.courses.getIdentifiers()
}
