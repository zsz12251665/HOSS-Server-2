import ORM, { Teacher } from '@/ORM'
import { wrap } from '@mikro-orm/core'
import { Context } from 'koa'


/** 单个教师 GET 请求 */
export async function single(ctx: Context) {
	const repo = ORM.em.getRepository(Teacher)
	const teacher = await repo.findOne(ctx.params.teacherID)
	if (teacher === null)
		ctx.throw(404)
	else
		ctx.body = wrap(teacher).toObject()
}

/** 教师批量 GET 请求 */
export async function batch(ctx: Context) {
	const repo = ORM.em.getRepository(Teacher)
	const teachers = await repo.findAll()
	ctx.body = teachers.map((teacher) => wrap(teacher).toObject())
}

/** 获取教师的课程列表 */
export async function courses(ctx: Context) {
	const repo = ORM.em.getRepository(Teacher)
	const teacher = await repo.findOne(ctx.params.teacherID, ['courses'])
	if (teacher === null)
		ctx.throw(404)
	else
		ctx.body = teacher.courses.getIdentifiers()
}
