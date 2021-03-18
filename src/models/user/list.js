/*
作业列表获取接口

GET 请求

- %URL%/:number：学生学号

返回结果

一个 JSON：{ id: number, title: string, deadline: number, validator: string, ?submitted: boolean }

- id：作业编号
- title：作业标题
- deadline：作业提交截止时间
- validator：文件名验证器（一个正则表达式）
- submitted：学生是否提交了作业（仅当 URL 中传递了有效的学生学号时）
*/

const db = require('../../components/db');
const express = require('express');

const router = express.Router();

async function getList() {
	return (await db.select('homeworks', {})).filter(item => item.deadline > Date.now());
}

async function getListWithStudentNumber(number) {
	if (await db.exists('students', { number }))
		return (await getList()).map(async item => Object.assign(item, {
			submitted: await db.exists('submissions', { student: number, homework: item.id })
		}));
	else
		return getList();
}

router.get('/', async (req, res) => {
	res.status(200).type('application/json').send(await getList());
});

router.get('/:number', async (req, res) => {
	res.status(200).type('application/json').send(await getListWithStudentNumber(req.params.number));
});
module.exports = router;