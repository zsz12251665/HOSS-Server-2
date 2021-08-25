import ORM, { User } from '@/ORM'
import { filterMiddleware, matchFunction } from '../filter'

const administratorChecker: matchFunction = async (ctx) => {
	if (ctx.state.authorization.isAdministrator === undefined) {
		const repo = ORM.em.getRepository(User)
		const user = await repo.findOne(ctx.state.authorization.userID)
		ctx.state.authorization.isAdministrator = user !== null && user.isAdministrator
	}
	return ctx.state.authorization.isAdministrator
}

const selfChecker: matchFunction = async (ctx) => {
	if (ctx.state.authorization.isResourceTeacher === undefined) {
		const repo = ORM.em.getRepository(User)
		const user = await repo.findOne(ctx.state.authorization.userID)
		ctx.state.authorization.isResourceTeacher = user !== null && user.teacher !== null && user.teacher.id === ctx.params.teacherID
	}
	return ctx.state.authorization.isResourceTeacher
}

const selfOrAdministratorChecker: matchFunction = async (ctx) => {
	if (ctx.state.authorization.isResourceTeacher === undefined || ctx.state.authorization.isAdministrator === undefined) {
		const repo = ORM.em.getRepository(User)
		const user = await repo.findOne(ctx.state.authorization.userID)
		ctx.state.authorization.isAdministrator = user !== null && user.isAdministrator
		ctx.state.authorization.isResourceTeacher = user !== null && user.teacher !== null && user.teacher.id === ctx.params.teacherID
	}
	return ctx.state.authorization.isResourceTeacher || ctx.state.authorization.isAdministrator
}

/** 过滤器：仅管理员 */
export const administratorOnly = filterMiddleware(administratorChecker)

/** 过滤器：仅资源教师自身 */
export const selfOnly = filterMiddleware(selfChecker)

/** 过滤器：资源教师自身和管理员 */
export const selfOrAdministrator = filterMiddleware(selfOrAdministratorChecker)
