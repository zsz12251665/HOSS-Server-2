/*
db 模块：MySQL 数据库再封装

- db.getPoolConnection(): Promise<mysql.PoolConnection>：从 MySQL 连接池中获取连接
- db.query(options: string | mysql.QueryOptions, values: any): Promise<mysql.Query>：向 MySQL 数据库发送询问
- db.createConnection(): mysql.Connection：创建新的 MySQL 连接（不从连接池中获取）
*/

const config = require('../config/mysql.json');
const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool(config); // MySQL 连接池

module.exports = {
	// getPoolConnection: util.promisify(pool.getConnection).bind(pool), // 从 MySQL 连接池中获取连接
	query: util.promisify(pool.query).bind(pool), // 向 MySQL 数据库发送询问
	createConnection: () => mysql.createConnection(config) // 创建新的 MySQL 连接（不从连接池中获取）
};
