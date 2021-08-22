import ORM, { Course } from '@/ORM'
import { wrap } from '@mikro-orm/core'
import { Context } from 'koa'


/** 单个课程 GET 请求 */
export async function single(ctx: Context) {
	const repo = ORM.em.getRepository(Course)
	const course = await repo.findOne(ctx.params.courseID)
	if (course === null)
		ctx.throw(404)
	else
		ctx.body = wrap(course).toObject()
}

/** 课程批量 GET 请求 */
export async function batch(ctx: Context) {
	const repo = ORM.em.getRepository(Course)
	const courses = await repo.findAll()
	ctx.body = courses.map((course) => wrap(course).toObject())
}

/** 获取课程的学生列表 */
export async function students(ctx: Context) {
	const repo = ORM.em.getRepository(Course)
	const course = await repo.findOne(ctx.params.courseID, ['students'])
	if (course === null)
		ctx.throw(404)
	else
		ctx.body = course.students.getIdentifiers()
}

/** 获取课程的任务列表 */
export async function tasks(ctx: Context) {
	const repo = ORM.em.getRepository(Course)
	const course = await repo.findOne(ctx.params.courseID, ['tasks'])
	if (course === null)
		ctx.throw(404)
	else
		ctx.body = course.tasks.getIdentifiers()
}

/** 获取课程的教师列表 */
export async function teachers(ctx: Context) {
	const repo = ORM.em.getRepository(Course)
	const course = await repo.findOne(ctx.params.courseID, ['teachers'])
	if (course === null)
		ctx.throw(404)
	else
		ctx.body = course.teachers.getIdentifiers()
}
