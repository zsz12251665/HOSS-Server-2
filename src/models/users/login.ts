import { Context } from 'koa'
import { User } from '@/ORM'
import hash from '@/hash'
import { encode } from '@/JWT'

export default async function loginMiddleware(ctx: Context): Promise<any> {
	const { username, password, tokenType } = ctx.request.body
	if (!username || !password)
		ctx.throw(400, 'The username and password should not be empty!')
	if (ctx.params.username && ctx.params.username !== username)
		ctx.throw(400, 'The username does not match!')
	const user = await User.findOne({
		where: {
			identification: username,
			certificate: hash(password)
		}
	})
	if (user)
		return encode({ username, tokenType }, tokenType ?? 'userToken')
	else
		ctx.throw(403, 'The username or password is incorrect!')
}
