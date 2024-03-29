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

const relatedMonitorChecker: filterFunction = async (ctx) => {
	if (ctx.state.authorization.hasManagedTasks === undefined) {
		const user = await ORM.em.findOne(User, <string>ctx.state.authorization.userID, ['tasks'])
		ctx.state.authorization.hasManagedTasks = user !== null && user.tasks.getItems().some((task) => task.course.id === ctx.params.courseID)
		ctx.state.authorization.user = user
	}
	return ctx.state.authorization.hasManagedTasks
}

const monitorChecker: filterFunction = async (ctx) => {
	if (ctx.state.authorization.isMonitor === undefined) {
		const task = await ORM.em.findOne(Task, [ctx.params.courseID, ctx.params.taskID], ['monitors'])
		ctx.state.authorization.isMonitor = task !== null && task.monitors.contains(ORM.em.getReference(User, ctx.state.authorization.userID))
	}
	return ctx.state.authorization.isMonitor
}

/** 过滤器：所有相关人员（有相关任务的助教或相关学生或相关教师） */
export const allRelatedOnes = filterMiddleware(async (ctx) => await relatedStudentChecker(ctx) || await relatedTeacherChecker(ctx) || await relatedMonitorChecker(ctx))

/** 过滤器：助教或相关学生或相关教师 */
export const monitorOrStudentOrTeacher = filterMiddleware(async (ctx) => await monitorChecker(ctx) || await relatedStudentChecker(ctx) || await relatedTeacherChecker(ctx))

/** 过滤器：仅相关教师 */
export const teacherOnly = filterMiddleware(relatedTeacherChecker)
