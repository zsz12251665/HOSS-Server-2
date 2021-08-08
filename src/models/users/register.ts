import { Context } from 'koa'
import { User } from '@/ORM'

export default async function registerMiddleware(ctx: Context): Promise<any> {
	const { username, password } = ctx.request.body
	if (!username || !password)
		ctx.throw(400, 'The username and password should not be empty!')
	const user = await User.findByPk(username)
	if (user)
		ctx.throw(403, 'The username has been taken!')
	else {
		await User.create({ identification: username, certificate: password })
		ctx.status = 201
		ctx.body = `User ${username} has been created!`
	}
}
