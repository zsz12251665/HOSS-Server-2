import hash from '@/hash'
import ORM, { User } from '@/ORM'
import { Rules, validate, validateDictionary } from '@/parameter'
import { wrap } from '@mikro-orm/core'
import { Context } from 'koa'

interface IUser {
	identification?: string
	certificate?: string
	isAdministrator?: boolean
	student?: string | null
	teacher?: number | null
}

const rules: Rules = {
	username: 'string',
	password: 'password',
	isAdministrator: 'boolean?',
	studentNumber: 'string?',
	teacherID: 'integer?'
}

function unserialize(body: any): IUser {
	const user: IUser = {}
	user.identification = body.username
	user.certificate = hash(body.password)
	user.isAdministrator = body.isAdministrator ?? false
	user.student = body.studentNumber ?? null
	user.teacher = body.teacherID ?? null
	return user
}

/** 单个 PUT 请求 */
export async function putSingle(ctx: Context) {
	validate(rules, ctx.request.body, (errors) => ctx.throw(400, JSON.stringify(errors)))
	const repo = ORM.em.getRepository(User)
	let user = await repo.findOne(ctx.params.username)
	if (user === null) {
		user = repo.create(unserialize(ctx.request.body))
		repo.persist(user)
	} else
		wrap(user).assign(unserialize(ctx.request.body))
	await repo.flush()
	ctx.body = wrap(user).toObject()
}

/** 批量 PUT 请求 */
export async function putMultiple(ctx: Context) {
	validateDictionary(rules, ctx.request.body, (errors) => ctx.throw(400, JSON.stringify(errors)))
	const body = ctx.request.body
	const repo = ORM.em.getRepository(User)
	const users = await repo.find(Object.keys(body))
	const usernames = users.map((user) => user.identification)
	Object.keys(body).forEach((username) => {
		let user = users[usernames.indexOf(username)]
		if (user === undefined) {
			user = repo.create(unserialize(body[username]))
			repo.persist(user)
			users.push(user)
			usernames.push(username)
		} else
			wrap(user).assign(unserialize(body[username]))
	})
	await repo.flush()
	ctx.body = users.map((user) => wrap(user).toObject())
}
