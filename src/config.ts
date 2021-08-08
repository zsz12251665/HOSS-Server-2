import 'module-alias/register'
import { randomBytes } from 'crypto'
import fs from 'fs'
import { prompt as ask, Separator } from 'inquirer'
import path from 'path'
import ORM, { User } from '@/ORM'
import hash from '@/hash'

/** 服务器配置 */
async function updateServer(): Promise<void> {
	const configPath = 'config/server.json'
	const defaultConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
	console.log('----- Server Config -----')
	const config = await ask([{
		name: 'port',
		type: 'number',
		message: 'Server Port:',
		default: defaultConfig.port || 80,
		validate: (input) => input ? true : 'Port should not be empty!'
	}])
	fs.writeFileSync(configPath, JSON.stringify(config, null, '\t'))
	console.log('Server config is up to date!')
}

/** MikroORM 配置 */
async function updateDB(): Promise<void> {
	const configPath = 'config/db.json'
	const defaultConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
	for (; ;) {
		console.log('----- DB Config -----')
		const config = await ask([
			{
				name: 'type',
				type: 'list',
				message: 'Dialect:',
				choices: ['mariadb', 'mysql', 'postgresql', 'sqlite'],
				default: defaultConfig.type || 'mysql',
			}, {
				name: 'host',
				type: 'input',
				when: (answers) => answers.type !== 'sqlite',
				message: 'Host:',
				default: defaultConfig.host || 'localhost',
				validate: (input) => input ? true : 'Host should not be empty!'
			}, {
				name: 'port',
				type: 'number',
				when: (answers) => answers.type !== 'sqlite',
				message: 'Port:',
				default: defaultConfig.port || 3306,
				validate: (input) => input ? true : 'Port should not be empty!'
			}, {
				name: 'user',
				type: 'input',
				when: (answers) => answers.type !== 'sqlite',
				message: 'Username:',
				default: defaultConfig.username || 'root',
				validate: (input) => input ? true : 'Username should not be empty!'
			}, {
				name: 'password',
				type: 'password',
				mask: '*',
				when: (answers) => answers.type !== 'sqlite',
				message: 'Password:',
				default: defaultConfig.password
			}, {
				name: 'dbName',
				type: 'input',
				message: 'Database:',
				default: defaultConfig.dbName,
				validate: (input) => input ? true : 'Database should not be empty!',
				filter: (input, answers) => answers.type === 'sqlite' && input !== ':memory:' ? path.resolve(path.normalize(input)) : input
			}
		])
		const orm = await ORM(config)
		if (orm.isConnected()) {
			console.log('Connect to the data server successfully!')
			fs.writeFileSync(configPath, JSON.stringify(config, null, '\t'))
			console.log('DB config is up to date!')
			break
		} else
			console.error('Fail to connect to the data server!')
	}
	const orm = await ORM()
	const migrator = orm.getMigrator()
	const initialized = (await migrator.getExecutedMigrations()).length + (await migrator.getPendingMigrations()).length
	if (!initialized) {
		console.log('Creating initial migration...')
		await migrator.createInitialMigration()
		console.log('Applying migration(s)...')
		await migrator.up()
		console.log('Database initialization complete!')
		console.log('Creating the first administrator...')
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
				message: 'Administrator Password:',
				filter: (input) => hash(input)
			}
		])
		await orm.em.persistAndFlush(orm.em.create(User, Object.assign(administrator, { isAdministrator: true })))
	} else {
		const { updateSchema } = await ask([{
			name: 'updateSchema',
			type: 'confirm',
			message: 'Update Schema?'
		}])
		if (updateSchema) {
			await migrator.createMigration()
			await migrator.up()
			console.log('Database schema is up to date!')
		}
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
			when: (answers) => !answers.useRandomSecret,
			message: 'JWT Secret:',
			default: defaultConfig.secret
		}, {
			name: 'issuer',
			type: 'input',
			message: 'JWT Issuer:',
			default: defaultConfig.issuer
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
	console.log('JWT config is up to date!')
}

async function main(): Promise<void> {
	if (!JSON.parse(fs.readFileSync('config/jwt.json', 'utf-8')).secret) {
		console.log('Initializing...')
		await updateServer()
		await updateDB()
		await updateJWT()
		console.log('Config Initialization Complete!')
	}
	for (; ;) {
		const { action } = await ask([{
			name: 'action',
			type: 'list',
			message: 'Which Config to Modify?',
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
