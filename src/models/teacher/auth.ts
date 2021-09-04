import ORM, { User } from '@/ORM'
import { filterMiddleware, filterFunction } from '../filter'

const administratorChecker: filterFunction = async (ctx) => {
	if (ctx.state.authorization.isAdministrator === undefined) {
		if (ctx.state.authorization.user === undefined)
			ctx.state.authorization.user = await ORM.em.findOne(User, <string>ctx.state.authorization.userID)
		const user: User | null = ctx.state.authorization.user
		ctx.state.authorization.isAdministrator = user !== null && user.isAdministrator
	}
	return ctx.state.authorization.isAdministrator
}

const selfChecker: filterFunction = async (ctx) => {
	if (ctx.state.authorization.isResourceTeacher === undefined) {
		if (ctx.state.authorization.user === undefined)
			ctx.state.authorization.user = await ORM.em.findOne(User, <string>ctx.state.authorization.userID)
		const user: User | null = ctx.state.authorization.user
		ctx.state.authorization.isResourceTeacher = user !== null && user.teacher !== null && user.teacher.id === ctx.params.teacherID
	}
	return ctx.state.authorization.isResourceTeacher
}

/** 过滤器：仅管理员 */
export const administratorOnly = filterMiddleware(administratorChecker)

/** 过滤器：仅资源教师自身 */
export const selfOnly = filterMiddleware(selfChecker)

/** 过滤器：资源教师自身和管理员 */
export const selfOrAdministrator = filterMiddleware(async (ctx) => await administratorChecker(ctx) || await selfChecker(ctx))
