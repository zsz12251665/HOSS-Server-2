import ORM, { User } from '@/ORM'
import { filterMiddleware, filterFunction } from '../filter'

const administratorChecker: filterFunction = async (ctx) => {
	if (ctx.state.authorization.isAdministrator === undefined) {
		const user = await ORM.em.findOne(User, <string>ctx.state.authorization.userID)
		ctx.state.authorization.isAdministrator = user !== null && user.isAdministrator
	}
	return ctx.state.authorization.isAdministrator
}

const selfChecker: filterFunction = async (ctx) => ctx.state.authorization.userID === ctx.params.userID

/** 过滤器：仅管理员 */
export const administratorOnly = filterMiddleware(administratorChecker)

/** 过滤器：仅资源用户自身 */
export const selfOnly = filterMiddleware(selfChecker)

/** 过滤器：资源用户自身和管理员 */
export const selfOrAdministrator = filterMiddleware(async (ctx) => await selfChecker(ctx) || await administratorChecker(ctx))
