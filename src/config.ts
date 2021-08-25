import 'module-alias/register'
import ORM, { User } from '@/ORM'
import { randomBytes } from 'crypto'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { prompt as ask, Separator } from 'inquirer'

/** 服务器配置 */
async function updateServer(isInitializing: boolean = false) {
	const configPath = 'config/server.json'
	const defaultConfig = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf-8')) : {}
	if (isInitializing && defaultConfig.port)
		return
	console.log('----- Server Config -----')
	const config = await ask([{
		name: 'port',
		type: 'number',
		message: 'Server Port:',
		default: defaultConfig.port || 80,
		validate: (input) => input ? true : 'Port should not be empty!'
	}])
	writeFileSync(configPath, JSON.stringify(config, null, '\t'))
	console.log('Server config is up to date!')
}

/** ORM 配置 */
async function updateORM(isInitializing: boolean = false) {
	const configPath = 'config/orm.json'
	const defaultConfig = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf-8')) : {}
	if (isInitializing && defaultConfig.dbName)
		return
	for (; ;) {
		console.log('----- ORM Config -----')
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
				default: defaultConfig.password || undefined
			}, {
				name: 'dbName',
				type: 'input',
				message: 'Database:',
				default: defaultConfig.dbName || undefined,
				validate: (input) => input ? true : 'Database should not be empty!',
			}
		])
		await ORM.init(config)
		if (ORM.orm.isConnected()) {
			console.log('Connect to the database successfully!')
			writeFileSync(configPath, JSON.stringify(config, null, '\t'))
			console.log('ORM config is up to date!')
			break
		} else
			console.error('Fail to connect to the database!')
	}
	await ORM.init()
	const migrator = ORM.orm.getMigrator()
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
				name: 'id',
				type: 'input',
				message: 'Administrator Username:',
				default: 'root'
			}, {
				name: 'password',
				type: 'password',
				mask: '*',
				message: 'Administrator Password:'
			}
		])
		administrator.isAdministrator = true
		await ORM.em.persistAndFlush(ORM.em.create(User, administrator))
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
async function updateJWT(isInitializing: boolean = false) {
	const configPath = 'config/jwt.json'
	const defaultConfig = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf-8')) : {}
	if (isInitializing && defaultConfig.secret)
		return
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

async function main() {
	await updateServer(true)
	await updateORM(true)
	await updateJWT(true)
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
				await updateORM()
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
