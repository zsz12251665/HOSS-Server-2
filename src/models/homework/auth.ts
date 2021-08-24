import ORM, { Task, Student, Teacher, User } from '@/ORM'
import { filterMiddleware, matchFunction } from '../filter'

const relatedStudentChecker: matchFunction = async (ctx) => {
	if (ctx.state.authorization.isRelatedStudent === undefined) {
		const repo = ORM.em.getRepository(Student)
		const student = await repo.findOne({ user: ctx.state.authorization.userID }, ['courses'])
		ctx.state.authorization.isRelatedStudent = student !== null && student.courses.getIdentifiers().includes(ctx.params.courseID)
	}
	return ctx.state.authorization.isRelatedStudent
}

const relatedTeacherChecker: matchFunction = async (ctx) => {
	if (ctx.state.authorization.isRelatedTeacher === undefined) {
		const repo = ORM.em.getRepository(Teacher)
		const teacher = await repo.findOne({ user: ctx.state.authorization.userID }, ['courses'])
		ctx.state.authorization.isRelatedTeacher = teacher !== null && teacher.courses.getIdentifiers().includes(ctx.params.courseID)
	}
	return ctx.state.authorization.isRelatedTeacher
}

const monitorChecker: matchFunction = async (ctx) => {
	if (ctx.state.authorization.isMonitor === undefined) {
		const repo = ORM.em.getRepository(Task)
		const task = await repo.findOne([ctx.params.courseID, ctx.params.taskID], ['monitors'])
		ctx.state.authorization.isMonitor = task !== null && task.monitors.contains(ORM.em.getReference(User, ctx.state.authorization.userID))
	}
	return ctx.state.authorization.isMonitor
}

const studentChecker: matchFunction = async (ctx) => {
	if (ctx.state.authorization.isStudent === undefined) {
		const repo = ORM.em.getRepository(User)
		const user = await repo.findOne(ctx.state.authorization.userID)
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
