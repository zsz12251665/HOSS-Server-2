const config = require('../../config/server.json');
const db = require('../../components/db');
const token = require('../../components/token');
const archiver = require('archiver');
const express = require('express');
const path = require('path');

const router = express.Router();

router.use(token.authorizationController);

router.get('/:id', async (req, res) => {
	try {
		const homeworkId = req.params.id;
		if (!await db.exists('homeworks', { id: homeworkId }))
			throw { status: 404, message: 'Homework not found!' };
		try {
			const students = await db.query('SELECT * FROM students');
			const missingList = [];
			const archive = archiver('zip');
			archive.pipe(res);
			for (const student of students) {
				const submission = (await db.query('SELECT * FROM submissions WHERE `student` = ? AND `homework` = ? ORDER BY `time` DESC LIMIT 1', [student.number, homeworkId]))[0];
				if (submission)
					archive.file(path.resolve(config.savePath, submission.id), { name: submission.filename });
				else
					missingList.push(student);
			}
			if (missingList.length)
				archive.append(JSON.stringify(missingList), { name: 'missingList.json' });
			archive.finalize();
		} catch (err) {
			console.log(err);
			throw { status: 500, message: err.message };
		}
	} catch ({ status, message }) {
		res.status(status).type('text/plain').send(message);
	}
});

module.exports = router;
