const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function initServer() { // 初始化服务器配置
	console.log('----- Server Config -----');
	const serverConfig = await inquirer.prompt([
		{
			name: 'port',
			type: 'number',
			message: 'Server Port:',
			default: 80
		}, {
			name: 'savePath',
			type: 'input',
			message: 'File Save Path:',
			validate: input => fs.existsSync(input) || 'The path does not exist!',
			filter: input => path.resolve(path.normalize(input))
		}
	]);
	fs.writeFileSync('src/config/server.json', JSON.stringify(serverConfig, null, '\t'));
}

async function initMySQL() { // 初始化 MySQL 配置
	console.log('----- MySQL Config -----');
	const mysqlConfig = await inquirer.prompt([
		{
			name: 'host',
			type: 'input',
			message: 'MySQL Hostname:',
			default: 'localhost'
		}, {
			name: 'port',
			type: 'number',
			message: 'MySQL Port:',
			default: 3306
		}, {
			name: 'user',
			type: 'input',
			message: 'MySQL Username:',
			default: 'root'
		}, {
			name: 'password',
			type: 'password',
			message: 'MySQL Password:'
		}, {
			name: 'database',
			type: 'input',
			message: 'MySQL Database:'
		}
	]);
	fs.writeFileSync('src/config/mysql.json', JSON.stringify(mysqlConfig, null, '\t'));
	const { initDatabase } = await inquirer.prompt([{
		name: 'initDatabase',
		type: 'confirm',
		message: 'Initialize Database?'
	}]);
	if (initDatabase) {
		const db = require('./components/db');
		await db.query('DROP TABLE IF EXISTS `submissions`, `homeworks`, `students`');
		await db.query(`CREATE TABLE students (
			\`name\` VARCHAR(255) NOT NULL COMMENT '学生姓名',
			\`number\` VARCHAR(255) NOT NULL COMMENT '学生学号',
			PRIMARY KEY (\`number\`)
		) CHARSET=utf8mb4`); // 学生列表
		await db.query(`CREATE TABLE homeworks (
			\`id\` INT NOT NULL AUTO_INCREMENT COMMENT '作业编号',
			\`title\` VARCHAR(255) NOT NULL COMMENT '作业标题',
			\`deadline\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作业提交截止时间',
			\`validator\` VARCHAR(255) NOT NULL COMMENT '文件名验证器（一个正则表达式）',
			PRIMARY KEY (\`id\`)
		) CHARSET=utf8mb4`); // 作业列表
		await db.query(`CREATE TABLE submissions (
			\`id\` INT NOT NULL AUTO_INCREMENT COMMENT '提交编号',
			\`student\` VARCHAR(255) NOT NULL COMMENT '学生学号',
			\`homework\` INT NOT NULL COMMENT '作业编号',
			\`time\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
			\`filename\` VARCHAR(255) NOT NULL COMMENT '作业文件名',
			PRIMARY KEY (\`id\`),
			FOREIGN KEY (\`student\`) REFERENCES students(\`number\`)
				ON UPDATE CASCADE
				ON DELETE CASCADE,
			FOREIGN KEY (\`homework\`) REFERENCES homeworks(\`id\`)
				ON UPDATE CASCADE
				ON DELETE CASCADE
		) CHARSET=utf8mb4`); // 提交列表
	}
}

async function initJWT() { // 初始化 JWT 配置
	console.log('----- JWT Config -----');
	const { randomSecret } = await inquirer.prompt([{
		name: 'randomSecret',
		type: 'confirm',
		message: 'Use Random JWT Secret?'
	}]);
	const jwtConfig = await inquirer.prompt([
		{
			name: 'secret',
			type: 'password',
			message: 'JWT Secret:',
			when: () => !randomSecret
		}, {
			name: 'issuer',
			type: 'input',
			message: 'JWT Issuer:'
		}
	]);
	if (randomSecret)
		jwtConfig.secret = crypto.randomBytes(16).toString('hex');
	jwtConfig.options = {
		userToken: {
			algorithm: 'HS256',
			expiresIn: '2h'
		},
		default: {
			algorithm: 'HS256',
			expiresIn: '15min'
		}
	};
	fs.writeFileSync('src/config/jwt.json', JSON.stringify(jwtConfig, null, '\t'));
}

async function initAdmin() { // 初始化管理员配置
	console.log('----- Admin Config -----');
	const adminConfig = await inquirer.prompt([
		{
			name: 'username',
			type: 'input',
			message: 'Admin Username:'
		}, {
			name: 'password',
			type: 'password',
			message: 'Admin Password:'
		}
	]);
	fs.writeFileSync('src/config/admin.json', JSON.stringify(adminConfig, null, '\t'));
}

async function initialize() {
	await initServer();
	await initMySQL();
	await initJWT();
	await initAdmin();
	process.exit();
}

initialize();
