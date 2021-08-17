import hash from '@/hash'
import ORM, { User } from '@/ORM'
import { Rules, validate, validateDictionary } from '@/parameter'
import { wrap } from '@mikro-orm/core'
import { Context } from 'koa'

const rules: Rules = {
	username: 'string',
	password: 'password',
	isAdministrator: 'boolean?',
	studentNumber: 'string?',
	teacherID: 'integer?'
}

interface IUser {
	identification: string
	certificate: string
	isAdministrator: boolean
	student: string | null
	teacher: number | null
}

const unserialize = (body: any): IUser => ({
	identification: body.username,
	certificate: hash(body.password),
	isAdministrator: body.isAdministrator ?? false,
	student: body.studentNumber ?? null,
	teacher: body.teacherID ?? null
})

/** 单个用户 PUT 请求 */
export async function single(ctx: Context) {
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

/** 用户批量 PUT 请求 */
export async function batch(ctx: Context) {
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
