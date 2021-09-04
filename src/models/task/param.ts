import ORM, { Course } from '@/ORM'
import { RouterContext } from '@koa/router'
import { Next } from 'koa'

export default async function paramValidator(ctx: RouterContext, next: Next) {
	const course = await ORM.em.findOne(Course, ctx.params.courseID)
	if (course === null)
		ctx.throw(404)
	ctx.state.course = course
	await next()
}
