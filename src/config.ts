require('module-alias/register')
import { prompt as ask, Separator } from 'inquirer'
import fs from 'fs'
import path from 'path'
import { randomBytes } from 'crypto'
import { Sequelize } from 'sequelize'

/** 服务器配置 */
async function updateServer(): Promise<void> {
	const configPath = 'config/server.json'
	const defaultConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
	console.log('----- Server Config -----')
	const config = await ask([{
		name: 'port',
		type: 'number',
		message: 'Server Port:',
		default: defaultConfig.port || 80
	}])
	fs.writeFileSync(configPath, JSON.stringify(config, null, '\t'))
	console.log('Server Config Updated!')
}

/** Sequelize 配置 */
async function updateDB(): Promise<void> {
	const configPath = 'config/db.json'
	const defaultConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
	for (;;) {
		console.log('----- DB Config -----')
		const config = await ask([
			{
				name: 'dialect',
				type: 'list',
				message: 'Dialect:',
				choices: ['mariadb', 'mssql', 'mysql', 'postgres', 'sqlite'],
				default: defaultConfig.dialect || 'mysql'
			}, {
				name: 'host',
				type: 'input',
				when: answers => answers.dialect !== 'sqlite',
				message: 'Hostname:',
				default: defaultConfig.host || 'localhost'
			}, {
				name: 'port',
				type: 'number',
				when: answers => answers.dialect !== 'sqlite',
				message: 'Port:',
				default: defaultConfig.port || 3306
			}, {
				name: 'username',
				type: 'input',
				when: answers => answers.dialect !== 'sqlite',
				message: 'Username:',
				default: defaultConfig.username || 'root'
			}, {
				name: 'password',
				type: 'password',
				mask: '*',
				when: answers => answers.dialect !== 'sqlite',
				message: 'Password:',
				default: defaultConfig.password || undefined
			}, {
				name: 'database',
				type: 'input',
				when: answers => answers.dialect !== 'sqlite',
				message: 'Database:',
				default: defaultConfig.database || undefined,
				validate: input => input ? true : 'Database should not be empty!'
			}, {
				name: 'storage',
				type: 'input',
				when: answers => answers.dialect === 'sqlite',
				message: 'Storage:',
				default: defaultConfig.storage || ':memory:'
			}
		])
		try {
			await new Sequelize(config).authenticate()
			Object.assign(config, {
				logging: false,
				define: {
					timestamps: false
				}
			})
			fs.writeFileSync(configPath, JSON.stringify(config, null, '\t'))
			break
		} catch (err) {
			console.error(err)
			Object.assign(defaultConfig, config)
		}
	}
	const { needInitialization } = await ask([{
		name: 'needInitialization',
		type: 'confirm',
		message: 'Initialize DB?'
	}])
	if (needInitialization) {
		const { User } = await import('@/ORM')
		await User.sequelize?.sync({ force: true })
		const administrator = await ask([
			{
				name: 'identification',
				type: 'input',
				message: 'Administrator Username:',
				default: 'root'
			}, {
				name: 'certificate',
				type: 'password',
				mask: '*',
				message: 'Administrator Password:'
			}
		])
		await User.create(Object.assign(administrator, { isAdministrator: true }))
		console.log('DB Initialization Complete!')
	}
}

/** JWT 配置 */
async function updateJWT(): Promise<void> {
	const configPath = 'config/jwt.json'
	const defaultConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
	console.log('----- JWT Config -----')
	const config = await ask([
		{
			name: 'useRandomSecret',
			type: 'confirm',
			message: 'Use Random JWT Secret?'
		}, {
			name: 'secret',
			type: 'password',
			mask: '*',
			when: answers => !answers.useRandomSecret,
			message: 'JWT Secret:',
			default: defaultConfig.secret || undefined
		}, {
			name: 'issuer',
			type: 'input',
			message: 'JWT Issuer:',
			default: defaultConfig.issuer || undefined
		}
	])
	if (config.useRandomSecret)
		config.secret = randomBytes(16).toString('hex')
		delete config.useRandomSecret
	config.options = {
		userToken: {
			algorithm: 'HS256',
			expiresIn: '2h'
		},
		default: {
			algorithm: 'HS256',
			expiresIn: '15min'
		}
	}
	fs.writeFileSync(configPath, JSON.stringify(config, null, '\t'))
	console.log('JWT Config Updated!')
}

async function main(): Promise<void> {
	if (!JSON.parse(fs.readFileSync('config/jwt.json', 'utf-8')).secret) {
		console.log('Initializing...')
		await updateServer()
		await updateDB()
		await updateJWT()
		console.log('Config Initialization Complete!')
	}
	for (;;) {
		const { action } = await ask([{
			name: 'action',
			type: 'list',
			message: 'Which Config?',
			choices: ['Server', 'DB', 'JWT', new Separator(), 'Exit'],
			default: 'Exit'
		}])
		switch (action) {
			case 'Server':
				await updateServer()
				break
			case 'DB':
				await updateDB()
				break
			case 'JWT':
				await updateJWT()
				break
			case 'Exit':
				process.exit()
			}
	}
}

if (require.main === module)
	main()
