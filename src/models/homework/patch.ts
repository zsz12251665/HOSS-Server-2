import ORM, { Course, Homework } from '@/ORM'
import { EntityData, Primary, wrap } from '@mikro-orm/core'
import Joi from 'joi'
import { Context } from 'koa'

const idSchema = Joi.string().pattern(/\w+$/)
const schema = Joi.object({
	group: idSchema.allow(null).optional()
})
const batchSchema = Joi.array().items(Joi.array().ordered(idSchema, schema))

const trim = (obj: { [key: string]: any }) => Object.keys(obj).filter((key) => obj[key] === undefined).forEach((key) => delete obj[key])

/** 单个作业 PATCH 请求 */
export async function single(ctx: Context) {
	const body: EntityData<Homework> = await schema.validateAsync(ctx.request.body)
	trim(body)
	const { courseID, taskID, studentID }: { [key: string]: string } = ctx.params
	const course: Course = ctx.state.course
	await ORM.em.populate(course, ['students'])
	if (!course.students.getIdentifiers().includes(studentID))
		ctx.throw(404)
	const repo = ORM.em.getRepository(Homework)
	let homework = await repo.findOne([[courseID, taskID], studentID])
	if (homework === null) {
		homework = repo.create({ task: [courseID, taskID], student: studentID })
		repo.persist(homework)
	}
	wrap(homework).assign(body)
	await repo.flush()
	ctx.body = wrap(homework).toObject()
}

/** 作业批量 PATCH 请求 */
export async function batch(ctx: Context) {
	const body: [string, EntityData<Homework>][] = await batchSchema.validateAsync(Object.entries(ctx.request.body))
	body.forEach(([_, data]) => trim(data))
	const bodyMap = new Map(body)
	const { courseID, taskID }: { [key: string]: string } = ctx.params
	const course: Course = ctx.state.course
	await ORM.em.populate(course, ['students'])
	const relatedStudentIDs = course.students.getIdentifiers()
	const updatedStudentIDs = body.map((entry) => entry[0]).filter((studentID) => relatedStudentIDs.includes(studentID))
	if (updatedStudentIDs.length === 0)
		ctx.throw(404, 'No homework is found!')
	const repo = ORM.em.getRepository(Homework)
	const homeworks = await repo.find(updatedStudentIDs.map((studentID) => <Primary<Homework>>[[courseID, taskID], studentID]))
	const homeworkStudentIDs = homeworks.map((homework) => homework.student.id)
	updatedStudentIDs.forEach((studentID) => {
		if (!homeworkStudentIDs.includes(studentID)) {
			const homework = repo.create({ task: [courseID, taskID], student: studentID })
			repo.persist(homework)
			homeworks.push(homework)
			homeworkStudentIDs.push(homework.student.id)
		}
		wrap(homeworks[homeworkStudentIDs.indexOf(studentID)]).assign(bodyMap.get(studentID))
	})
	await repo.flush()
	ctx.body = homeworks.map((homework) => wrap(homework).toObject())
}
