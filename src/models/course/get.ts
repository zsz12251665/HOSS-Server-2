import ORM, { Course, Student, Teacher } from '@/ORM'
import { wrap } from '@mikro-orm/core'
import { RouterContext } from '@koa/router'

/** 单个课程 GET 请求 */
export async function single(ctx: RouterContext) {
	const repo = ORM.em.getRepository(Course)
	const course = await repo.findOne(ctx.params.courseID)
	if (course === null)
		ctx.throw(404)
	ctx.body = wrap(course).toObject()
}

/** 课程批量 GET 请求 */
export async function batch(ctx: RouterContext) {
	const repo = ORM.em.getRepository(Course)
	if (ctx.state.authorization.isAdministrator) {
		const courses = await repo.findAll()
		ctx.body = courses.map((course) => wrap(course).toObject())
	} else {
		const courseIDs: string[] = []
		if (ctx.state.authorization.isRelatedStudent) {
			/** @see {@link ./auth.ts:16} */
			const student: Student = ctx.state.authorization.student
			courseIDs.push(...student.courses.getIdentifiers())
		}
		if (ctx.state.authorization.isRelatedTeacher) {
			/** @see {@link ./auth.ts:25} */
			const teacher: Teacher = ctx.state.authorization.teacher
			courseIDs.push(...teacher.courses.getIdentifiers())
		}
		ctx.body = (await repo.find(courseIDs)).map((course) => wrap(course).toObject())
	}
}

/** 课程的学生列表 GET 请求 */
export async function students(ctx: RouterContext) {
	const repo = ORM.em.getRepository(Course)
	const course = await repo.findOne(ctx.params.courseID, ['students'])
	if (course === null)
		ctx.throw(404)
	ctx.body = course.students.getIdentifiers()
}

/** 课程的教师列表 GET 请求 */
export async function teachers(ctx: RouterContext) {
	const repo = ORM.em.getRepository(Course)
	const course = await repo.findOne(ctx.params.courseID, ['teachers'])
	if (course === null)
		ctx.throw(404)
	ctx.body = course.teachers.getIdentifiers()
}
