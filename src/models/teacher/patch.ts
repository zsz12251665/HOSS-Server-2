import ORM, { Course, Teacher } from '@/ORM'
import { Rules, validate } from '@/parameter'
import { Context } from 'koa'

export async function single(ctx: Context) {
	ctx.throw(501)
}

export async function batch(ctx: Context) {
	ctx.throw(501)
}

export async function courses(ctx: Context) {
	const rules: Rules = {
		insert: {
			type: 'array?',
			itemType: 'integer'
		},
		delete: {
			type: 'array?',
			itemType: 'integer'
		}
	}
	validate(rules, ctx.request.body, (errors) => ctx.throw(400, JSON.stringify(errors)))
	const repo = ORM.em.getRepository(Teacher)
	const teacher = await repo.findOne(ctx.params.teacherID, ['courses'])
	if (teacher === null)
		ctx.throw(404)
	const courseRepo = ORM.em.getRepository(Course)
	teacher.courses.add(...(await courseRepo.find(ctx.request.body.insert)))
	teacher.courses.remove(...(await courseRepo.find(ctx.request.body.delete)))
	await repo.flush()
	ctx.body = teacher.courses.getIdentifiers()
}
