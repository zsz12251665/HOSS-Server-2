import ORM, { Task, Student, Teacher, User } from '@/ORM'
import { filterMiddleware, filterFunction } from '../filter'

const relatedStudentChecker: filterFunction = async (ctx) => {
	if (ctx.state.authorization.isRelatedStudent === undefined) {
		const student = await ORM.em.findOne(Student, { user: ctx.state.authorization.userID }, ['courses'])
		ctx.state.authorization.isRelatedStudent = student !== null && student.courses.getIdentifiers().includes(ctx.params.courseID)
	}
	return ctx.state.authorization.isRelatedStudent
}

const relatedTeacherChecker: filterFunction = async (ctx) => {
	if (ctx.state.authorization.isRelatedTeacher === undefined) {
		const teacher = await ORM.em.findOne(Teacher, { user: ctx.state.authorization.userID }, ['courses'])
		ctx.state.authorization.isRelatedTeacher = teacher !== null && teacher.courses.getIdentifiers().includes(ctx.params.courseID)
	}
	return ctx.state.authorization.isRelatedTeacher
}

const monitorChecker: filterFunction = async (ctx) => {
	if (ctx.state.authorization.isMonitor === undefined) {
		/** @see {@link ./param.ts:9} */
		const task: Task = ctx.state.task
		if (!task.monitors.isInitialized())
			await ORM.em.populate(task, ['monitors'])
		ctx.state.authorization.isMonitor = task !== null && task.monitors.contains(ORM.em.getReference(User, ctx.state.authorization.userID))
	}
	return ctx.state.authorization.isMonitor
}

const studentChecker: filterFunction = async (ctx) => {
	if (ctx.state.authorization.isStudent === undefined) {
		const user = await ORM.em.findOne(User, <string>ctx.state.authorization.userID)
		ctx.state.authorization.isStudent = user !== null && user.student !== null && user.student.id === ctx.params.studentID
	}
	return ctx.state.authorization.isStudent
}

/** 过滤器：所有相关人员（助教或相关学生或相关教师） */
export const allRelatedOnes = filterMiddleware(async (ctx) => await monitorChecker(ctx) || await relatedStudentChecker(ctx) || await relatedTeacherChecker(ctx))

/** 过滤器：助教或相关教师 */
export const monitorOrTeacher = filterMiddleware(async (ctx) => await monitorChecker(ctx) || await relatedTeacherChecker(ctx))

/** 过滤器：仅资源学生 */
export const studentOnly = filterMiddleware(studentChecker)

/** 过滤器：资源学生或助教或相关教师 */
export const studentOrMonitorOrTeacher = filterMiddleware(async (ctx) => await studentChecker(ctx) || await monitorChecker(ctx) || await relatedTeacherChecker(ctx))

/** 过滤器：仅相关教师 */
export const teacherOnly = filterMiddleware(relatedTeacherChecker)

/** 过滤器：相关教师或资源学生 */
export const teacherOrStudent = filterMiddleware(async (ctx) => await relatedTeacherChecker(ctx) || await studentChecker(ctx))
