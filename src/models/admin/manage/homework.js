const db = require('../../../components/db');
const token = require('../../../components/token');
const express = require('express');

const router = express.Router();

router.use(token.authorizationController);

router.get('/', async (req, res) => {
	res.status(200).type('application/json').json(await db.query('SELECT * FROM homeworks'));
});

router.put('/', async (req, res) => {
	const { title, deadline, validator } = req.body;
	if (!title || !deadline || !validator) {
		res.status(400).type('text/plain').send('Incomplete form!');
		return;
	}
	if (await db.exists('homeworks', { title, deadline })) {
		res.status(400).type('text/plain').send('Homework exists!');
		return;
	}
	try {
		await db.insert('homeworks', { title, deadline, validator });
		res.status(204).send();
	} catch (err) {
		console.log(err);
		res.status(500).type('text/plain').send(err.message);
	}
});

router.patch('/:id', async (req, res) => {
	const oldEntry = { id: req.params.id }, newEntry = {};
	for(const key of ['title', 'deadline', 'validator'])
		if (req.body[key])
			newEntry[key] = req.body[key];
	if (!await db.exists('homeworks', oldEntry)) {
		res.status(404).type('text/plain').send('Homework not found!');
		return;
	}
	try {
		await db.update('homeworks', oldEntry, newEntry);
		res.status(204).send();
	} catch (err) {
		console.log(err);
		res.status(500).type('text/plain').send(err.message);
	}
});

router.delete('/:id', async (req, res) => {
	const oldEntry = { id: req.params.id };
	if (!await db.exists('homeworks', oldEntry)) {
		res.status(404).type('text/plain').send('Homework not found!');
		return;
	}
	try {
		await db.delete('homeworks', oldEntry);
		res.status(204).send();
	} catch (err) {
		console.log(err);
		res.status(500).type('text/plain').send(err.message);
	}
});

module.exports = router;
