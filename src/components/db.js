/*
db 模块：MySQL 数据库再封装

- db.query(options: string | mysql.QueryOptions, values: any): Promise<any>：向 MySQL 数据库发送询问
- db.insert(table: string, entry: object): Promise<any>：向 table 中插入 entry
- db.remove(table: string, entry: object): Promise<any>：从 table 中删除 entry
- db.update(table: string, oldEntry: object, newEntry: object): Promise<any>：将 table 中的 oldEntry 替换为 newEntry
- db.exists(table: string, entry: object): Promise<boolean>：判断 table 中是否在存在和 entry 匹配的行
*/

const config = require('../config/mysql.json');
const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool(config); // MySQL 连接池

function andStyleConvert(entry) {
	return 'True'.concat(...Object.keys(entry).map(() => ' AND ?? = ?'));
}

function andStyleRearrange(res, entry) {
	for (const key of Object.keys(entry))
		res.push(key, entry[key]);
	return res;
}

const query = util.promisify(pool.query).bind(pool);
const insert = (table, entry) => query('INSERT INTO ?? SET ?', [table, entry]);
const remove = (table, entry) => query('DELETE FROM ?? WHERE ' + andStyleConvert(entry), andStyleRearrange([table], entry));
const update = (table, oldEntry, newEntry) => query('UPDATE ?? SET ? WHERE ' + andStyleConvert(oldEntry), andStyleRearrange([table, newEntry], oldEntry));
const exists = async (table, entry) => Boolean((await query('SELECT 1 FROM ?? WHERE ' + andStyleConvert(entry), andStyleRearrange([table], entry)))[0]);

module.exports = { query, insert, remove, update, exists };
