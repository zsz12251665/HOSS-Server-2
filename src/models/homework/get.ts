import ORM, { Course, Homework } from '@/ORM'
import { wrap } from '@mikro-orm/core'
import { RouterContext } from '@koa/router'

/** 单个作业 GET 请求 */
export async function single(ctx: RouterContext) {
	const { courseID, taskID, studentID }: { [key: string]: string } = ctx.params
	/** @see {@link ../task/param.ts:9} */
	const course: Course = ctx.state.course
	if (!course.students.isInitialized())
		await ORM.em.populate(course, ['students'])
	if (!course.students.getIdentifiers().includes(studentID))
		ctx.throw(404)
	const repo = ORM.em.getRepository(Homework)
	let homework = await repo.findOne([[courseID, taskID], studentID])
	if (homework === null)
		homework = repo.create({ task: [courseID, taskID], student: studentID })
	ctx.body = wrap(homework).toObject()
}

/** 作业批量 GET 请求 */
export async function batch(ctx: RouterContext) {
	const { courseID, taskID }: { [key: string]: string } = ctx.params
	/** @see {@link ../task/param.ts:9} */
	const course: Course = ctx.state.course
	if (!course.students.isInitialized())
		await ORM.em.populate(course, ['students'])
	const studentIDs = course.students.getIdentifiers()
	const repo = ORM.em.getRepository(Homework)
	const homeworks = await repo.find({ task: [courseID, taskID] })
	const homeworkStudentIDs = homeworks.map((homework) => homework.student.id)
	ctx.body = studentIDs.map((studentID) => wrap(homeworkStudentIDs.includes(studentID) ? homeworks[homeworkStudentIDs.indexOf(studentID)] : repo.create({ task: [courseID, taskID], student: studentID })).toObject())
}
