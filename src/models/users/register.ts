import { Request, Response } from 'express'
import { User } from '@/ORM'
import { armour, HTTPResponse } from '@models/armour'

export async function registerMiddleware(req: Request, res: Response): Promise<any> {
	const { username, password } = req.body
	if (!username || !password)
		throw new HTTPResponse(400, 'The username and password should not be empty!')
	const user = await User.findByPk(username)
	if (user)
		throw new HTTPResponse(403, 'The username has been taken!')
	else {
		await User.create({ identification: username, certificate: password })
		return new HTTPResponse(201, `User ${username} has been created!`)
	}
}

export default armour(registerMiddleware)
