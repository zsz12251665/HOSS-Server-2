import { Request, Response } from 'express'
import { User } from '@/ORM'
import hash from '@/hash'
import { encode } from '@/JWT'
import { armour, HTTPResponse } from '@models/armour'

export async function loginMiddleware(req: Request, res: Response): Promise<any> {
	const { username, password, tokenType } = req.body
	if (!username || !password)
		throw new HTTPResponse(400, 'The username and password should not be empty!')
	if (req.params.username && req.params.username !== username)
		throw new HTTPResponse(400, 'The username does not match!')
	const user = await User.findOne({
		where: {
			identification: username,
			certificate: hash(password)
		}
	})
	if (user)
		return encode({ username, tokenType }, tokenType ?? 'userToken')
	else
		throw new HTTPResponse(403, 'The username or password is incorrect!')
}

export default armour(loginMiddleware)
