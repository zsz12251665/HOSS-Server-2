import ORM, { Course, Teacher } from '@/ORM'
import Joi from 'joi'
import { Context } from 'koa'

const coursesSchema = Joi.object({
	insert: Joi.array().items(Joi.number().integer().min(0)).optional(),
	delete: Joi.array().items(Joi.number().integer().min(0)).optional()
})

export async function single(ctx: Context) {
	ctx.throw(501)
}

export async function batch(ctx: Context) {
	ctx.throw(501)
}

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
