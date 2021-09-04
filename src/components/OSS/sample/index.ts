import { sign } from '@/JWT'
import BaseOSS from '../base'

class SampleOSS extends BaseOSS {
	async upload(identifier: string) {
		return {
			url: `${identifier}`,
			token: sign({
				action: 'upload',
				object: identifier
			})
		}
	}

	async download(identifier: string) {
		return {
			url: `${identifier}`,
			token: sign({
				action: 'download',
				object: identifier
			})
		}
	}

	async remove(identifier: string) {}

	async archive(identifiers: any) {
		return {
			url: 'package.zip',
			token: sign({
				action: 'download',
				object: 'package.zip'
			})
		}
	}

	constructor(config: any) {
		super()
	}
}

export default SampleOSS
