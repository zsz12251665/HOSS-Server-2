import ORM, { User } from '@/ORM'
import { filterMiddleware, matchFunction } from '../filter'

const administratorChecker: matchFunction = async (ctx) => {
	if (ctx.state.authorization.isAdministrator === undefined) {
		const repo = ORM.em.getRepository(User)
		const user = await repo.findOne(ctx.state.authorization.username)
		ctx.state.authorization.isAdministrator = user !== null && user.isAdministrator
	}
	return ctx.state.authorization.isAdministrator
}

const teacherOrAdministratorChecker: matchFunction = async (ctx) => {
	const repo = ORM.em.getRepository(User)
	const user = await repo.findOne(ctx.state.authorization.username)
	ctx.state.authorization.isAdministrator = user !== null && user.isAdministrator
	return <number>ctx.params.teacherID === user?.teacher?.id || ctx.state.authorization.isAdministrator
}

/** 过滤器：仅管理员 */
export const administratorOnly = filterMiddleware(administratorChecker)

/** 过滤器：本教师和管理员 */
export const teacherOrAdministrator = filterMiddleware(teacherOrAdministratorChecker)
