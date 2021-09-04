import ORM, { Task, Student } from '@/ORM'
import { wrap } from '@mikro-orm/core'
import { RouterContext } from '@koa/router'

/** 单个学生 GET 请求 */
export async function single(ctx: RouterContext) {
	const repo = ORM.em.getRepository(Student)
	const student = await repo.findOne(ctx.params.studentID)
	if (student === null)
		ctx.throw(404)
	ctx.body = wrap(student).toObject()
}

/** 学生批量 GET 请求 */
export async function batch(ctx: RouterContext) {
	const repo = ORM.em.getRepository(Student)
	const students = await repo.findAll()
	ctx.body = students.map((student) => wrap(student).toObject())
}

/** 学生的课程列表 GET 请求 */
export async function courses(ctx: RouterContext) {
	const repo = ORM.em.getRepository(Student)
	const student = await repo.findOne(ctx.params.studentID, ['courses'])
	if (student === null)
		ctx.throw(404)
	ctx.body = student.courses.getIdentifiers()
}

/** 学生的任务列表 GET 请求 */
export async function tasks(ctx: RouterContext) {
	const repo = ORM.em.getRepository(Student)
	const student = await repo.findOne(ctx.params.studentID, ['courses'])
	if (student === null)
		ctx.throw(404)
	const tasks = await ORM.em.find(Task, { course: { id: { $in: student.courses.getIdentifiers() } } })
	ctx.body = tasks.map((task) => wrap(task).toObject())
}
