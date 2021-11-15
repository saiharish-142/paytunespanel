const express=require('express')
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
require('../db')
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	const path = require('path');
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

app.listen(port, () => console.log(`app listening on port ${port}!`));

require('../utils/script')