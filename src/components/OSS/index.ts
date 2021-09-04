import config from '@config/oss.json'
import BaseOSS from './base'
import SampleOSS from './sample'

const functionMap = new Map<string, (config: any) => BaseOSS>([
	['SampleOSS', (config) => new SampleOSS(config)]
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
