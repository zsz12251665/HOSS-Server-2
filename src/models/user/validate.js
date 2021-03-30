const db = require('../../components/db');
const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
	const { name, number } = req.body;
	if (await db.exists('students', { name, number }))
		res.status(200).type('text/plain').send('Student Found!');
	else
		res.status(404).type('text/plain').send('Student Not Found!');
});
module.exports = router;
