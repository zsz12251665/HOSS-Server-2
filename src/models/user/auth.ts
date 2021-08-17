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

const selfChecker: matchFunction = async (ctx) => ctx.state.authorization.username === ctx.params.username

/** 过滤器：仅管理员 */
export const administratorOnly = filterMiddleware(administratorChecker)

/** 过滤器：仅资源用户自身 */
export const selfOnly = filterMiddleware(selfChecker)

/** 过滤器：资源用户自身和管理员 */
export const selfOrAdministrator = filterMiddleware(async (ctx) => await selfChecker(ctx) || await administratorChecker(ctx))
