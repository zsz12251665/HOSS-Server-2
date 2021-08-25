import ORM, { Course } from '@/ORM'
import { Context, Next } from 'koa'

export default async function paramValidator(ctx: Context, next: Next) {
	const course = await ORM.em.getRepository(Course).findOne(ctx.params.courseID)
	if (course === null)
		ctx.throw(404)
	ctx.state.course = course
	await next()
}
