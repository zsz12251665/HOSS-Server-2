import { randomBytes } from 'crypto'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { prompt as ask } from 'inquirer'

const configPath = 'config/jwt.json'

async function configure() {
	const defaultConfig = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf-8')) : {}
	console.log('----- JWT Config -----')
	const config = await ask([
		{
			name: 'secret',
			type: 'input',
			message: 'JWT Secret (Leave it blank to use a random secret):',
			default: defaultConfig.secret || undefined,
			filter: (input) => input || randomBytes(16).toString('hex')
		}, {
			name: 'issuer',
			type: 'input',
			message: 'JWT Issuer:',
			default: defaultConfig.issuer || undefined
		}
	])
	writeFileSync(configPath, JSON.stringify(config, null, '\t'))
	console.log('JWT config is up to date!')
}

export default configure
