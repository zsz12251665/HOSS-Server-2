import { ValidationError } from 'joi'
import { JsonWebTokenError } from 'jsonwebtoken'
import { Context, Next } from 'koa'

/** Joi.ValidationError 错误处理 */
export async function joiErrorHandler(ctx: Context, next: Next) {
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

/** jsonwebtoken.JsonWebTokenError 错误处理 */
export async function jsonwebtokenErrorHandler(ctx: Context, next: Next) {
	try {
		await next()
	} catch (err) {
		if (err instanceof JsonWebTokenError) {
			ctx.status = 401
			ctx.body = err.message
		} else
			throw err
	}
}
