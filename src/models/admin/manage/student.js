const db = require('../../../components/db');
const token = require('../../../components/token');
const express = require('express');

const router = express.Router();

router.use(token.authorizationController);

router.get('/', async (req, res) => {
	res.status(200).type('application/json').json(await db.query('SELECT * FROM students'));
});

router.put('/', async (req, res) => {
	const { name, number } = req.body;
	if (!name || !number) {
		res.status(400).type('text/plain').send('Incomplete form!');
		return;
	}
	if (await db.exists('students', { number })) {
		res.status(400).type('text/plain').send('Student exists!');
		return;
	}
	try {
		await db.insert('students', { name, number });
		res.status(204).send();
	} catch (err) {
		console.log(err);
		res.status(500).type('text/plain').send(err.message);
	}
});

router.patch('/:number', async (req, res) => {
	const oldEntry = { number: req.params.number }, newEntry = {};
	for(const key of ['name', 'number'])
		if (req.body[key])
			newEntry[key] = req.body[key];
	if (!await db.exists('students', oldEntry)) {
		res.status(404).type('text/plain').send('Student not found!');
		return;
	}
	try {
		await db.update('students', oldEntry, newEntry);
		res.status(204).send();
	} catch (err) {
		console.log(err);
		res.status(500).type('text/plain').send(err.message);
	}
});

router.delete('/:number', async (req, res) => {
	const oldEntry = { number: req.params.number };
	if (!await db.exists('students', oldEntry)) {
		res.status(404).type('text/plain').send('Student not found!');
		return;
	}
	try {
		await db.delete('students', oldEntry);
		res.status(204).send();
	} catch (err) {
		console.log(err);
		res.status(500).type('text/plain').send(err.message);
	}
});

module.exports = router;
