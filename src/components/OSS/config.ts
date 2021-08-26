import { existsSync, readFileSync, writeFileSync } from 'fs'
import { prompt as ask } from 'inquirer'
import LocalOSS from './local/config'

const configPath = 'config/oss.json'

const functionMap = new Map<string, (config: any) => Promise<any>>([
	['local', LocalOSS]
])

async function configure() {
	const defaultConfig = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf-8')) : {}
	console.log('----- OSS Config -----')
	const { dialect } = await ask([{
		name: 'dialect',
		type: 'list',
		message: 'Which OSS to use?',
		choices: [...functionMap.keys()],
		default: defaultConfig.dialect || undefined
	}])
	const configureOSS = functionMap.get(dialect)
	if (configureOSS === undefined)
		throw new Error('Unknown OSS is used!')
	const config = Object.assign({ dialect }, await configureOSS(defaultConfig))
	writeFileSync(configPath, JSON.stringify(config, null, '\t'))
	console.log('OSS config is up to date!')
}

export default configure