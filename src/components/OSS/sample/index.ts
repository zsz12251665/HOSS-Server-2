import { encode } from '@/JWT'
import BaseOSS from '../base'

class SampleOSS extends BaseOSS {
	async upload(identifier: string) {
		return {
			url: `${identifier}`,
			token: encode({
				action: 'upload',
				object: identifier
			})
		}
	}

	async download(identifier: string) {
		return {
			url: `${identifier}`,
			token: encode({
				action: 'download',
				object: identifier
			})
		}
	}

	async remove(identifier: string) {}

	async archive(identifiers: any) {
		return {
			url: 'package.zip',
			token: encode({
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
