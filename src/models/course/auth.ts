import ORM, { Student, Teacher, User } from '@/ORM'
import { filterMiddleware, filterFunction } from '../filter'

const administratorChecker: filterFunction = async (ctx) => {
	if (ctx.state.authorization.isAdministrator === undefined) {
		const user = await ORM.em.findOne(User, <string>ctx.state.authorization.userID)
		ctx.state.authorization.isAdministrator = user !== null && user.isAdministrator
	}
	return ctx.state.authorization.isAdministrator
}

const relatedStudentChecker: filterFunction = async (ctx) => {
	if (ctx.state.authorization.isRelatedStudent === undefined) {
		const student = await ORM.em.findOne(Student, { user: ctx.state.authorization.userID }, ['courses'])
		ctx.state.authorization.isRelatedStudent = student !== null && (ctx.params.courseID === undefined || student.courses.getIdentifiers().includes(ctx.params.courseID))
		ctx.state.authorization.student = student
	}
	return ctx.state.authorization.isRelatedStudent
}

const relatedTeacherChecker: filterFunction = async (ctx) => {
	if (ctx.state.authorization.isRelatedTeacher === undefined) {
		const teacher = await ORM.em.findOne(Teacher, { user: ctx.state.authorization.userID }, ['courses'])
		ctx.state.authorization.isRelatedTeacher = teacher !== null && (ctx.params.courseID === undefined || teacher.courses.getIdentifiers().includes(ctx.params.courseID))
		ctx.state.authorization.teacher = teacher
	}
	return ctx.state.authorization.isRelatedTeacher
}

/** 过滤器：仅管理员 */
export const administratorOnly = filterMiddleware(administratorChecker)

/** 过滤器：仅相关学生或教师 */
export const studentOrTeacherOnly = filterMiddleware(async (ctx) => await relatedStudentChecker(ctx) || await relatedTeacherChecker(ctx))

/** 过滤器：学生、教师或管理员 */
export const studentOrTeacherOrAdministrator = filterMiddleware(async (ctx) => await administratorChecker(ctx) || await relatedStudentChecker(ctx) || await relatedTeacherChecker(ctx))
