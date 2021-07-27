require('module-alias/register');

const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Sequelize } = require('sequelize');

/** 初始化服务器配置 */
async function initializeServer() {
	const configPath = 'config/server.json';
	const defaultConfig = JSON.parse(fs.readFileSync(configPath));
	console.log('----- Server Config -----');
	const config = await inquirer.prompt([
		{
			name: 'port',
			type: 'number',
			message: 'Server Port:',
			default: defaultConfig.port || 80
		}, {
			name: 'path',
			type: 'input',
			message: 'File Save Path:',
			default: defaultConfig.path || undefined,
			validate: input => fs.existsSync(input) || 'The path does not exist!',
			filter: input => path.resolve(path.normalize(input))
		}
	]);
	fs.writeFileSync(configPath, JSON.stringify(config, null, '\t'));
	console.log('Server Config Updated!');
}

/** 初始化 Sequelize 配置 */
async function initializeDB() {
	const configPath = 'config/db.json';
	const defaultConfig = JSON.parse(fs.readFileSync(configPath));
	for(;;) {
		console.log('----- DB Config -----');
		const config = await inquirer.prompt([
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
		]);
		try {
			await new Sequelize(config).authenticate();
			fs.writeFileSync('config/db.json', JSON.stringify(config, null, '\t'));
			console.log('DB Config Updated!');
			break;
		} catch (err) {
			console.error(err);
			Object.assign(defaultConfig, config);
		}
	}
	const { needInitialization } = await inquirer.prompt([{
		name: 'needInitialization',
		type: 'confirm',
		message: 'Initialize DB?'
	}]);
	if (needInitialization) {
		const db = require('@components/db');
		await db.clear();
		const administratorProfile = await inquirer.prompt([
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
		]);
		db.User.build(Object.assign({ isAdministrator: true }, administratorProfile));
		console.log('DB Initialization Complete!');
	}
}

/** 初始化 JWT 配置 */
async function initializeJWT() {
	const configPath = 'config/jwt.json';
	const defaultConfig = JSON.parse(fs.readFileSync(configPath));
	console.log('----- JWT Config -----');
	const config = await inquirer.prompt([
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
	]);
	if (config.useRandomSecret)
		config.secret = crypto.randomBytes(16).toString('hex');
	delete config.useRandomSecret;
	config.options = {
		userToken: {
			algorithm: 'HS256',
			expiresIn: '2h'
		},
		default: {
			algorithm: 'HS256',
			expiresIn: '15min'
		}
	};
	fs.writeFileSync(configPath, JSON.stringify(config, null, '\t'));
	console.log('JWT Config Updated!');
}

async function main() {
	if (!JSON.parse(fs.readFileSync('config/server.json')).path) {
		console.log('Initializing...');
		await initializeServer();
		await initializeDB();
		await initializeJWT();
		console.log('Config Initialization Complete!');
	}
	for(;;) {
		const { action } = await inquirer.prompt([{
			name: 'action',
			type: 'list',
			message: 'Which Config?',
			choices: ['Server', 'DB', 'JWT', 'Exit'],
			default: 'exit'
		}]);
		switch (action) {
		case 'Server':
			await initializeServer();
			break;
		case 'DB':
			await initializeDB();
			break;
		case 'JWT':
			await initializeJWT();
			break;
		case 'Exit':
			process.exit();
			break;
		}
	}
}

main();
