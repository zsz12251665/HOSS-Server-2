/*
作业上传接口

PUT 请求字段

- studentName：学生姓名
- studentNumber：学生学号
- homeworkId：作业编号
- homeworkFile：作业文件
- homeworkFilename：作业文件名

返回结果

- HTTP 400 Bad Request：'Incomplete form!'，请求字段有误
- HTTP 401 Unauthorized：'No such student!'，查无此学生
- HTTP 401 Unauthorized：'No such homework!'，查无此作业
- HTTP 501 Not Implemented：'Function not implemented!'，功能未实现

*/

const db = require('../../components/db');
const express = require('express');

const router = express.Router();

async function saveFile(req) {
	const { studentName, studentNumber, homeworkId, homeworkFilename } = req.body, { homeworkFile } = req.files;
	if (!(studentName && studentNumber && homeworkId && homeworkFilename && homeworkFile))
		return { status: 400, message: 'Incomplete form!' };
	if (!await db.select('students', { name: studentName, number: studentNumber }))
		return { status: 401, message: 'No such student!' };
	if (!await db.select('homeworks', { id: homeworkId }))
		return { status: 401, message: 'No such homework!' };
	return { status: 501, message: 'Function not implemented!' };
}

router.put('/', async (req, res) => {
	const { status, message } = await saveFile(req);
	res.status(status).type('text/plain').send(message);
});

module.exports = router;
