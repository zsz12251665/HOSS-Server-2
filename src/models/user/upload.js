/*
作业上传接口

PUT 请求字段

- studentName：学生姓名
- studentNumber：学生学号
- homeworkId：作业编号
- homeworkFile：作业文件
- homeworkFilename：作业文件名

返回结果

- HTTP 200 OK：'Homework uploaded!'，作业已成功上传
- HTTP 400 Bad Request：'Incomplete form!'，请求字段有误
- HTTP 403 Forbidden：'Invalid filename!'，作业名不正确
- HTTP 404 Not Found：'No such student!'，查无此学生
- HTTP 404 Not Found：'No such homework!'，查无此作业
*/

const config = require('../../config/server.json');
const db = require('../../components/db');
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

async function saveFile(req) {
	const { studentName, studentNumber, homeworkId, homeworkFilename } = req.body, { homeworkFile } = req.files;
	if (!(studentName && studentNumber && homeworkId && homeworkFilename && homeworkFile))
		return { status: 400, message: 'Incomplete form!' };
	if (!await db.exists('students', { name: studentName, number: studentNumber }))
		return { status: 401, message: 'No such student!' };
	const homework = (await db.query('SELECT * FROM homeworks WHERE ?', [{ id: homeworkId }]))[0];
	if (!homework)
		return { status: 401, message: 'No such homework!' };
	if (!new RegExp(homework.validator.replace('{name}', studentName).replace('{number}', studentNumber)).test(homeworkFilename))
		return { status: 403, message: 'Invalid filename!' };
	await db.insert('submissions', { student: studentNumber, homework: homeworkId, filename: homeworkFilename });
	const submission = (await db.query('SELECT LAST_INSERT_ID() AS lastId'))[0];
	fs.renameSync(homeworkFile.path, path.resolve(config.savePath, submission));
	return { status: 200, message: 'Homework uploaded!' };
}

router.put('/', async (req, res) => {
	const { status, message } = await saveFile(req);
	res.status(status).type('text/plain').send(message);
});

module.exports = router;
