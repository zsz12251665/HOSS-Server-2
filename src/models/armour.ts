import { RequestHandler, Request, Response, NextFunction } from 'express'

export class HTTPResponse {
	message?: string
	status: number

	/**
	 * @constructor
	 */
	 constructor();
	 /**
	  * @constructor
	  * @param {number} status HTTP 状态码
	  */
	 constructor(status: number);
	/**
	 * @constructor
	 * @param {string} message 错误信息
	 */
	constructor(message: string);
	/**
	 * @constructor
	 * @param {number} status HTTP 状态码
	 * @param {string} message 错误信息
	 */
	constructor(status: number, message: string);
	constructor(status: number | string = 500, message?: string) {
		if (typeof status === 'string') {
			this.message = status
			this.status = 500
		} else {
			this.message = message
			this.status = status
		}
	}

	sendThrough(res: Response): void {
		if (this.message === undefined)
			res.sendStatus(this.status)
		else
			res.status(this.status).type('text/plain').send(this.message)
	}
}

export function armour(func: Function): RequestHandler {
	return async function (req: Request, res: Response, next: NextFunction) {
		try {
			const result = await func(req, res)
			if (result === undefined)
				next()
			else if (result.constructor === HTTPResponse)
				result.sendThrough(res)
			else if (typeof result === 'string')
				res.status(200).type('text/plain').send(result)
			else if (typeof result === 'object')
				res.status(200).json(result)
		} catch (err) {
			if (err.constructor === HTTPResponse)
				err.sendThrough(res)
			else if (err instanceof Error) {
				res.sendStatus(500)
				throw err
			}
			else
				next(err)
		}
	}
}
