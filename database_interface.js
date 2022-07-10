'use strict';
const mysql = require('mysql');

const con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '13801380',
});
con.connect((err) => {
	if (err) {
		throw err;
	}
	console.log('Connected!');
});

con.query('USE HighlightDB; SELECT * FROM Media;', (err, result) => {
	if (err) {
		throw err;
	}
	console.log(result);
});
