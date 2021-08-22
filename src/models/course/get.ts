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
	if (ctx.state.authorization.isAdministrator) {
		const courses = await repo.findAll()
		ctx.body = courses.map((course) => wrap(course).toObject())
	} else {
		const courses: Course[] = []
		if (ctx.state.authorization.isRelatedStudent)
			courses.push(...await repo.find({ $in: <string[]>ctx.state.authorization.studentCourses }))
		if (ctx.state.authorization.isRelatedTeacher)
			courses.push(...await repo.find({ $in: <string[]>ctx.state.authorization.teacherCourses }))
		ctx.body = courses.map((course) => wrap(course).toObject())
	}
}

/** 课程的学生列表 GET 请求 */
export async function students(ctx: Context) {
	const repo = ORM.em.getRepository(Course)
	const course = await repo.findOne(ctx.params.courseID, ['students'])
	if (course === null)
		ctx.throw(404)
	else
		ctx.body = course.students.getIdentifiers()
}

/** 课程的教师列表 GET 请求 */
export async function teachers(ctx: Context) {
	const repo = ORM.em.getRepository(Course)
	const course = await repo.findOne(ctx.params.courseID, ['teachers'])
	if (course === null)
		ctx.throw(404)
	else
		ctx.body = course.teachers.getIdentifiers()
}
