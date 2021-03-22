/*
db 模块：MySQL 数据库再封装

- db.query(options: string | mysql.QueryOptions, values: any): Promise<any>：向 MySQL 数据库发送询问
- db.insert(table: string, entry: object): Promise<any>：向 table 中插入 entry
- db.remove(table: string, entry: object): Promise<any>：从 table 中删除 entry
- db.update(table: string, oldEntry: object, newEntry: object): Promise<any>：将 table 中的 oldEntry 替换为 newEntry
- db.select(table: string, entry: object): Promise<any>：返回 table 中和 entry 匹配的行
- db.exists(table: string, entry: object): Promise<boolean>：判断 table 中是否在存在和 entry 匹配的行
*/

const config = require('../config/mysql.json');
const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool(config); // MySQL 连接池

const query = util.promisify(pool.query).bind(pool);
const insert = (table, entry) => query('INSERT INTO ?? SET ?', [table, entry]);
const remove = (table, entry) => query('DELETE FROM ?? WHERE ?', [table, entry]);
const update = (table, oldEntry, newEntry) => query('UPDATE ?? SET ? WHERE ?', [table, newEntry, oldEntry]);
const select = (table, entry, clause = '') => query('SELECT * FROM ?? WHERE ? ' + clause, [table, entry]);
const exists = async (table, entry) => (await select(table, entry, 'LIMIT 1')).length > 0;

module.exports = { query, insert, remove, update, select, exists };
