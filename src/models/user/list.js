const db = require('../../components/db');
const express = require('express');

const router = express.Router();

async function getList() {
	return db.query('SELECT * FROM homeworks WHERE `deadline` > CURRENT_TIMESTAMP');
}

async function getListWithStudentNumber(number) {
	if (await db.exists('students', { number }))
		return await Promise.all((await getList()).map(async item => Object.assign(item, {
			submitted: await db.exists('submissions', { student: number, homework: item.id })
		})));
	else
		return getList();
}

router.get('/', async (req, res) => {
	res.status(200).type('application/json').json(await getList());
});

router.get('/:number', async (req, res) => {
	res.status(200).type('application/json').json(await getListWithStudentNumber(req.params.number));
});
module.exports = router;
