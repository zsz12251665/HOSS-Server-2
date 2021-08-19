import ORM, { Teacher } from '@/ORM'
import { wrap } from '@mikro-orm/core'
import Joi from 'joi'
import { Context } from 'koa'

const coursesSchema = Joi.array().items(Joi.number().integer().min(0))

/** 单个教师 PUT 请求 */
export async function single(ctx: Context) {
	ctx.throw(501)
}

/** 教师批量 PUT 请求 */
export async function batch(ctx: Context) {
	ctx.throw(501)
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
