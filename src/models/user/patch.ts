import hash from '@/hash'
import ORM, { User } from '@/ORM'
import { Rules, validate, validateDictionary } from '@/parameter'
import { wrap } from '@mikro-orm/core'
import { Context } from 'koa'

const rules: Rules = {
	username: 'string?',
	password: 'password?',
	isAdministrator: 'boolean?',
	studentNumber: 'string?',
	teacherID: 'integer?'
}

interface IUser {
	identification?: string
	certificate?: string
	isAdministrator?: boolean
	student?: string | null
	teacher?: number | null
}

function unserialize(body: any, isAdministrator: boolean = true): IUser {
	const user: IUser = {}
	user.identification = body.username
	user.certificate = body.password ? hash(body.password) : undefined
	if (isAdministrator) {
		user.isAdministrator = body.isAdministrator
		user.student = body.studentNumber
		user.teacher = body.teacherID
	}
	return user
}

/** 单个用户 PATCH 请求 */
export async function single(ctx: Context) {
	validate(rules, ctx.request.body, (errors) => ctx.throw(400, JSON.stringify(errors)))
	const repo = ORM.em.getRepository(User)
	const user = await repo.findOne(ctx.params.username)
	if (user === null)
		ctx.throw(404)
	wrap(user).assign(unserialize(ctx.request.body, ctx.state.authorization.isAdministrator))
	await repo.flush()
	ctx.body = wrap(user).toObject()
}

/** 用户批量 PATCH 请求 */
export async function batch(ctx: Context) {
	validateDictionary(rules, ctx.request.body, (errors) => ctx.throw(400, JSON.stringify(errors)))
	const body = ctx.request.body
	const repo = ORM.em.getRepository(User)
	const users = await repo.find(Object.keys(body))
	if (users.length === 0)
		ctx.throw(404, 'No user is found!')
	users.forEach((user) => wrap(user).assign(unserialize(body[user.identification])))
	await repo.flush()
	ctx.body = users.map((user) => wrap(user).toObject())
}
