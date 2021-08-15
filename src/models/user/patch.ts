import hash from '@/hash'
import ORM, { User } from '@/ORM'
import { wrap } from '@mikro-orm/core'
import { Context } from 'koa'

interface IUser {
	identification?: string
	certificate?: string
	isAdministrator?: boolean
	student?: string
	teacher?: number
}

function unserialize(body: any, isAdministrator: boolean = true): IUser {
	const user: IUser = {}
	user.identification = body.username
	user.certificate = hash(body.password)
	if (isAdministrator) {
		user.isAdministrator = body.isAdministrator
		user.student = body.studentNumber
		user.teacher = body.teacherID
	}
	return user
}

/** 单个 PATCH 请求 */
export async function patchSingle(ctx: Context) {
	const repo = ORM.em.getRepository(User)
	const user = await repo.findOne(ctx.params.username)
	if (user === null)
		ctx.throw(404)
	wrap(user).assign(unserialize(ctx.request.body, ctx.state.authorization.isAdministrator))
	await repo.flush()
	ctx.body = wrap(user).toObject()
}

/** 批量 PATCH 请求 */
export async function patchMultiple(ctx: Context) {
	const repo = ORM.em.getRepository(User)
	const body = ctx.request.body
	const users = await repo.find(Object.keys(body))
	if (users.length === 0)
		ctx.throw(404, 'No user is found!')
	users.forEach((user) => wrap(user).assign(unserialize(body[user.identification])))
	ctx.body = users.map((user) => wrap(user).toObject())
}
