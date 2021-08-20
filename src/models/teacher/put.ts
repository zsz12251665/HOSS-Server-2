import ORM, { Teacher } from '@/ORM'
import { EntityData, wrap } from '@mikro-orm/core'
import Joi from 'joi'
import { Context } from 'koa'

const schema = Joi.object({
	id: Joi.number().integer().min(0).required(),
	name: Joi.string().required(),
	username: Joi.string().pattern(/\w+$/).allow(null).default(null)
})

const batchSchema = Joi.array().items(Joi.array().ordered(Joi.number().integer().min(0), schema))

const coursesSchema = Joi.array().items(Joi.number().integer().min(0))

const unserialize = (body: any): EntityData<Teacher> => ({
	id: body.id,
	name: body.name,
	user: body.username
})

/** 单个教师 PUT 请求 */
export async function single(ctx: Context) {
	const body = await schema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Teacher)
	let teacher = await repo.findOne(ctx.params.teacherID)
	if (teacher === null) {
		teacher = repo.create(unserialize(body))
		repo.persist(teacher)
	} else
		wrap(teacher).assign(unserialize(body))
	await repo.flush()
	ctx.body = wrap(teacher).toObject()
}

/** 教师批量 PUT 请求 */
export async function batch(ctx: Context) {
	const body: [any, any][] = await batchSchema.validateAsync(Object.entries(ctx.request.body))
	const repo = ORM.em.getRepository(Teacher)
	const teachers = await repo.find(body.map((entry) => entry[0]))
	const teacherIDs = teachers.map((teacher) => teacher.id)
	body.forEach(([teacherID, data]) => {
		let teacher = teachers[teacherIDs.indexOf(teacherID)]
		if (teacher === undefined) {
			teacher = repo.create(unserialize(data))
			repo.persist(teacher)
			teachers.push(teacher)
			teacherIDs.push(teacherID)
		} else
			wrap(teacher).assign(unserialize(data))
	})
	await repo.flush()
	ctx.body = teachers.map((teacher) => wrap(teacher).toObject())
}

/** 覆写教师的课程列表 */
export async function courses(ctx: Context) {
	const body = await coursesSchema.validateAsync(ctx.request.body)
	const repo = ORM.em.getRepository(Teacher)
	const teacher = await repo.findOne(ctx.params.teacherID, ['courses'])
	if (teacher === null)
		ctx.throw(404)
	wrap(teacher).assign({ courses: body })
	await repo.flush()
	ctx.body = teacher.courses.getIdentifiers()
}
