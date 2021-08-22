import ORM, { Student, Teacher, User } from '@/ORM'
import { filterMiddleware, matchFunction } from '../filter'

const administratorChecker: matchFunction = async (ctx) => {
	if (ctx.state.authorization.isAdministrator === undefined) {
		const repo = ORM.em.getRepository(User)
		const user = await repo.findOne(ctx.state.authorization.userID)
		ctx.state.authorization.isAdministrator = user !== null && user.isAdministrator
	}
	return ctx.state.authorization.isAdministrator
}

const relatedStudentChecker: matchFunction = async (ctx) => {
	if (ctx.state.authorization.isRelatedStudent === undefined) {
		const repo = ORM.em.getRepository(Student)
		const student = await repo.findOne({ user: ctx.state.authorization.userID }, ['courses'])
		if (student === null)
			ctx.state.authorization.isRelatedStudent = false
		else if (ctx.params.courseID === undefined) {
			ctx.state.authorization.isRelatedStudent = true
			ctx.state.authorization.studentNumber = student.id
		} else
			ctx.state.authorization.isRelatedStudent = student.courses.getIdentifiers().includes(ctx.params.courseID)
	}
	return ctx.state.authorization.isRelatedStudent
}

const relatedTeacherChecker: matchFunction = async (ctx) => {
	if (ctx.state.authorization.isRelatedTeacher === undefined) {
		const repo = ORM.em.getRepository(Teacher)
		const teacher = await repo.findOne({ user: ctx.state.authorization.userID }, ['courses'])
		if (teacher === null)
			ctx.state.authorization.isRelatedTeacher = false
		else if (ctx.params.courseID === undefined) {
			ctx.state.authorization.isRelatedTeacher = true
			ctx.state.authorization.teacherID = teacher.id
		} else
			ctx.state.authorization.isRelatedTeacher = teacher.courses.getIdentifiers().includes(ctx.params.courseID)
	}
	return ctx.state.authorization.isRelatedTeacher
}

/** 过滤器：仅管理员 */
export const administratorOnly = filterMiddleware(administratorChecker)

/** 过滤器：仅相关学生或教师 */
export const studentOrTeacherOnly = filterMiddleware(async (ctx) => await relatedStudentChecker(ctx) || await relatedTeacherChecker(ctx))

/** 过滤器：学生、教师或管理员 */
export const studentOrTeacherOrAdministrator = filterMiddleware(async (ctx) => await relatedStudentChecker(ctx) || await relatedTeacherChecker(ctx) || await administratorChecker(ctx))
