import config from '@config/oss.json'
import BaseOSS from './base'
import LocalOSS from './local'

const functionMap = new Map<string, (config: any) => BaseOSS>([
	['local', (config) => new LocalOSS(config)]
])

class OSS {
	private static instance?: BaseOSS

	static async init() {
		const initOSS = functionMap.get(config.dialect)
		if (initOSS === undefined)
			throw new Error('Unknown OSS is used!')
		OSS.instance = initOSS(config)
	}

	static get client(): BaseOSS {
		if (OSS.instance === undefined)
			throw new Error('OSS is not initialized!')
		return OSS.instance
	}
}

export default OSS
