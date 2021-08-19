import ORM, { Teacher } from '@/ORM'
import { validate } from '@/parameter'
import { wrap } from '@mikro-orm/core'
import { Context } from 'koa'

export async function single(ctx: Context) {
	ctx.throw(501)
}

export async function batch(ctx: Context) {
	ctx.throw(501)
}

export async function courses(ctx: Context) {
	validate({ body: { type: 'array', itemType: 'integer' } }, { body: ctx.request.body }, (errors) => ctx.throw(400, JSON.stringify(errors)))
	const repo = ORM.em.getRepository(Teacher)
	const teacher = await repo.findOne(ctx.params.teacherID, ['courses'])
	if (teacher === null)
		ctx.throw(404)
	wrap(teacher).assign({ courses: ctx.request.body })
	await repo.flush()
	ctx.body = teacher.courses.getIdentifiers()
}
