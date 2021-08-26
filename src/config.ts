import 'module-alias/register'
import configureJWT from '@/JWT/config'
import configureORM from '@/ORM/config'
import configureOSS from '@/OSS/config'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { prompt as ask, Separator } from 'inquirer'
import { tmpdir } from 'os'

const configPath = 'config/app.json'

async function configureApp() {
	const defaultConfig = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf-8')) : {}
	console.log('----- App Config -----')
	const config = await ask([
		{
			name: 'port',
			type: 'number',
			message: 'Port:',
			default: defaultConfig.port || 80,
			validate: (input) => input ? true : 'Port should not be empty!'
		}, {
			name: 'tempDir',
			type: 'string',
			message: 'Temporary Directory:',
			default: tmpdir(),
			validate: (input) => existsSync(input)
		}
	])
	writeFileSync(configPath, JSON.stringify(config, null, '\t'))
	console.log('App config is up to date!')
}

const functionMap = new Map([
	['App', configureApp],
	['ORM', configureORM],
	['JWT', configureJWT],
	['OSS', configureOSS]
])

async function main() {
	if (!existsSync('config')) {
		console.log('Initializing Configurations...')
		mkdirSync('config')
		for (const configure of functionMap.values())
			await configure()
		console.log('Configuration Initialization Complete!')
	}
	for (; ;) {
		const { action } = await ask([{
			name: 'action',
			type: 'list',
			message: 'Which Config to Modify?',
			choices: [...functionMap.keys(), new Separator(), 'Exit'],
			default: 'Exit'
		}])
		if (action === 'Exit')
			process.exit()
		else
			await (functionMap.get(action) ?? (async () => {}))()
	}
}

if (require.main === module)
	main()
