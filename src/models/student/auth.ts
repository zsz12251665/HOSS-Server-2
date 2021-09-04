import ORM, { User } from '@/ORM'
import { filterMiddleware, filterFunction } from '../filter'

const administratorChecker: filterFunction = async (ctx) => {
	if (ctx.state.authorization.isAdministrator === undefined) {
		const repo = ORM.em.getRepository(User)
		const user = await repo.findOne(ctx.state.authorization.userID)
		ctx.state.authorization.isAdministrator = user !== null && user.isAdministrator
	}
	return ctx.state.authorization.isAdministrator
}

const selfChecker: filterFunction = async (ctx) => {
	if (ctx.state.authorization.isResourceStudent === undefined) {
		const repo = ORM.em.getRepository(User)
		const user = await repo.findOne(ctx.state.authorization.userID)
		ctx.state.authorization.isResourceStudent = user !== null && user.student !== null && user.student.id === ctx.params.studentID
	}
	return ctx.state.authorization.isResourceStudent
}

const selfOrAdministratorChecker: filterFunction = async (ctx) => {
	if (ctx.state.authorization.isResourceStudent === undefined || ctx.state.authorization.isAdministrator === undefined) {
		const repo = ORM.em.getRepository(User)
		const user = await repo.findOne(ctx.state.authorization.userID)
		ctx.state.authorization.isAdministrator = user !== null && user.isAdministrator
		ctx.state.authorization.isResourceStudent = user !== null && user.student !== null && user.student.id === ctx.params.studentID
	}
	return ctx.state.authorization.isResourceStudent || ctx.state.authorization.isAdministrator
}

/** 过滤器：仅管理员 */
export const administratorOnly = filterMiddleware(administratorChecker)

/** 过滤器：仅资源学生自身 */
export const selfOnly = filterMiddleware(selfChecker)

/** 过滤器：资源学生自身和管理员 */
export const selfOrAdministrator = filterMiddleware(selfOrAdministratorChecker)
