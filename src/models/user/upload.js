const config = require('../../config/server.json');
const db = require('../../components/db');
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

async function saveFile(req) {
	const { studentName, studentNumber, homeworkId, homeworkFilename } = req.body, { homeworkFile } = req.files;
	if (!studentName || !studentNumber || !homeworkId || !homeworkFilename || !homeworkFile)
		return { status: 400, message: 'Incomplete form!' };
	if (!await db.exists('students', { name: studentName, number: studentNumber }))
		return { status: 401, message: 'No such student!' };
	const homework = (await db.query('SELECT * FROM homeworks WHERE ?', [{ id: homeworkId }]))[0];
	if (!homework)
		return { status: 401, message: 'No such homework!' };
	if (!new RegExp(homework.validator.replace('{name}', studentName).replace('{number}', studentNumber)).test(homeworkFilename))
		return { status: 403, message: 'Invalid filename!' };
	await db.insert('submissions', { student: studentNumber, homework: homeworkId, filename: homeworkFilename });
	const submission = await db.query('SELECT MAX(`id`) AS lastId FROM `submissions` WHERE `student` = ? AND `homework` = ? AND `filename` = ?', [studentNumber, homeworkId, homeworkFilename]);
	fs.renameSync(homeworkFile.path, path.resolve(config.savePath, String(submission[0].lastId)));
	return { status: 200, message: 'Homework uploaded!' };
}

router.put('/', async (req, res) => {
	const { status, message } = await saveFile(req);
	res.status(status).type('text/plain').send(message);
});

module.exports = router;
