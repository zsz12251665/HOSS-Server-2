/*
学生信息验证接口

`/student`：POST 请求参数

- name：学生姓名
- number：学生学号

返回结果

- HTTP 200 OK：'Student Found!'，已找到该学生
- HTTP 404 Not Found：'Student Not Found!'，未找到该学生
*/

const db = require('../../components/db');
const express = require('express');

const router = express.Router();

async function findStudent(req) {
	const { name, number } = req.body;
	return await db.select('students', { name, number });
}

router.get('/', async (req, res) => {
	if (await findStudent(req))
		res.status(200).type('text/plain').send('Student Found!');
	else
		res.status(404).type('text/plain').send('Student Not Found!');
});
module.exports = router;
