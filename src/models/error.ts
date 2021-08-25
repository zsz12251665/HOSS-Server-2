import { ValidationError } from 'joi'
import { Context, Next } from 'koa'

/** Joi.ValidationError 错误处理 */
export async function joiValidationErrorHandler(ctx: Context, next: Next) {
	try {
		await next()
	} catch (err) {
		if (err instanceof ValidationError) {
			ctx.status = 400
			ctx.body = err.details
		} else
			throw err
	}
}
