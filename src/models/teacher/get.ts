import ORM, { Task, Teacher } from '@/ORM'
import { wrap } from '@mikro-orm/core'
import { Context } from 'koa'

/** 单个教师 GET 请求 */
export async function single(ctx: Context) {
	const repo = ORM.em.getRepository(Teacher)
	const teacher = await repo.findOne(ctx.params.teacherID)
	if (teacher === null)
		ctx.throw(404)
	ctx.body = wrap(teacher).toObject()
}

/** 教师批量 GET 请求 */
export async function batch(ctx: Context) {
	const repo = ORM.em.getRepository(Teacher)
	const teachers = await repo.findAll()
	ctx.body = teachers.map((teacher) => wrap(teacher).toObject())
}

/** 教师的课程列表 GET 请求 */
export async function courses(ctx: Context) {
	const repo = ORM.em.getRepository(Teacher)
	const teacher = await repo.findOne(ctx.params.teacherID, ['courses'])
	if (teacher === null)
		ctx.throw(404)
	ctx.body = teacher.courses.getIdentifiers()
}

/** 教师的任务列表 GET 请求 */
export async function tasks(ctx: Context) {
	const repo = ORM.em.getRepository(Teacher)
	const teacher = await repo.findOne(ctx.params.teacherID, ['courses'])
	if (teacher === null)
		ctx.throw(404)
	const tasks = await ORM.em.find(Task, { course: { id: { $in: teacher.courses.getIdentifiers() } } })
	ctx.body = tasks.map((task) => wrap(task).toObject())
}
