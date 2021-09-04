import { MikroORM } from '@mikro-orm/core'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { prompt as ask } from 'inquirer'
import entityConfiguration, { User } from './entities'

const configPath = 'config/orm.json'

const askConfiguration = (defaultConfig: { [key: string]: any }) => ask([
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

async function updateSchema(orm: MikroORM) {
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
		await orm.em.persistAndFlush(orm.em.create(User, administrator))
	} else {
		const { schemaUpdateRequired } = await ask([{
			name: 'schemaUpdateRequired',
			type: 'confirm',
			message: 'Update Schema?'
		}])
		if (schemaUpdateRequired) {
			await migrator.createMigration()
			await migrator.up()
			console.log('Database schema is up to date!')
		}
	}
}

export default async function () {
	const defaultConfig = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf-8')) : {}
	console.log('----- ORM Config -----')
	for (; ;) {
		const config = await askConfiguration(defaultConfig)
		const orm = await MikroORM.init(Object.assign({}, entityConfiguration, config))
		if (await orm.isConnected()) {
			console.log('Connect to the database successfully!')
			writeFileSync(configPath, JSON.stringify(config, null, '\t'))
			console.log('ORM config is up to date!')
			await updateSchema(orm)
			return
		} else
			console.error('Fail to connect to the database!')
	}
}
