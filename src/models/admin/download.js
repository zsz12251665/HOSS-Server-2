/*
作业下载接口

GET 请求

- %URL%/:id：作业编号
- 请求头 Authorization 字段：管理员令牌

返回结果

- HTTP 200 OK：一个 zip 文件，即打包好的作业文件
- HTTP 401 Unauthorized：'Invalid Token!'，令牌无效
- HTTP 404 Not Found：'Homework not found!'，作业编号不存在
- HTTP 500 Internal Server Error：服务器错误信息
*/

const config = require('../../config/server.json');
const db = require('../../components/db');
const token = require('../../components/token');
const archiver = require('archiver');
const express = require('express');
const path = require('path');

const router = express.Router();

async function processRequest(req, res) {
	const adminToken = req.get('Authorization'), homeworkId = req.params.id;
	if (token.decode(adminToken) === null)
		throw { status: 401, message: 'Invalid Token!' };
	if (!await db.exists('homeworks', { id: homeworkId }))
		throw { status: 404, message: 'Homework not found!' };
	try {
		const students = await db.query('SELECT * FROM students');
		const missingList = [];
		const archive = archiver('zip');
		archive.pipe(res);
		for (const student of students) {
			const submission = (await db.query('SELECT * FROM submissions WHERE ? ORDER BY `time` DESC LIMIT 1', [
				{ student: student.number, homework: homeworkId }
			]))[0];
			if (submission)
				archive.file(path.resolve(config.savePath, submission.id), { name: submission.filename });
			else
				missingList.push(student.name);
		}
		archive.append(JSON.stringify(missingList), { name: 'missingList.json' });
		archive.finalize();
	} catch (err) {
		console.log(err);
		throw { status: 500, message: err.message };
	}
}

router.get('/:id', async (req, res) => {
	try {
		await processRequest(req, res);
	} catch ({ status, message }) {
		res.status(status).type('text/plain').send(message);
	}
});

module.exports = router;
