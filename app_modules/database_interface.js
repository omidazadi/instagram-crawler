'use strict';
const mysql = require('mysql');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8')).dataBaseConfig;
const connection = mysql.createConnection(config);

function perform() {
	let sql,
		values = [],
		callback;
	switch (arguments.length) {
		case 2:
			sql = arguments[0];
			callback = arguments[1];
			break;
		case 3:
			sql = arguments[0];
			values = arguments[1];
			callback = arguments[2];
			break;
	}

	//console.log(mysql.format(sql, values));
	connection.query(sql, values, (err, result, fields) => {
		if (err) {
			throw err;
		}
		callback(result, fields);
	});
}

function init(callback) {
	connection.connect((err) => {
		if (err) {
			throw err;
		}
		let sql = 'USE HighlightDB;';
		perform(sql, (result, fields) => {
			console.log('Connected!');
			callback(result, fields);
		});
	});
}

function end(callback) {
	connection.end((err) => {
		if (err) {
			throw err;
		}
		console.log('Finished.');
		callback();
	});
}

function deleteAllPages(callback) {
	let sql = 'DELETE FROM Page;';
	perform(sql, callback);
}

function deleteAllCategories(callback) {
	let sql = 'DELETE FROM Category;';
	perform(sql, callback);
}

function deleteAllHighlights(callback) {
	let sql = 'DELETE FROM Highlight;';
	perform(sql, callback);

}

function deleteAllMedia(callback) {
	let sql = 'DELETE FROM Media;';
	perform(sql, callback);
}

function clearDatabase(callback) {
	deleteAllPages((result, fields) => {
		deleteAllCategories((result, fields) => {
			deleteAllHighlights((result, fields) => {
				deleteAllMedia((result, fields) => {
					callback(result, fields);
				});
			});
		});
	});
}

function getAllPages(callback) {
	let sql =
	'SELECT * FROM Page \
	ORDER BY \
		id;';
	perform(sql, callback);
}

function getAllCategories(callback) {
	let sql =
	'SELECT * FROM Category \
	ORDER BY \
		page, \
		name;';
	perform(sql, callback);
}

function getAllHighlights(callback) {
	let sql =
	'SELECT * FROM Highlight \
	ORDER BY \
		page, \
		category, \
		name, \
		id;';
	perform(sql, callback);
}

function getAllMedia(callback) {
	let sql =
	'SELECT * FROM Media \
	ORDER BY \
		id;';
	perform(sql, callback);
}

function addPage(id, callback) {
	let sql =
	'INSERT INTO Page(id) \
		VALUES(' + connection.escape(id) + ');';
	perform(sql, callback);
}

function addCategory(page, name, callback) {
	let sql =
	'INSERT INTO Category(page, name) \
		VALUES(' + connection.escape(page) + ', ' + connection.escape(name) + ');';
	perform(sql, callback);
}

function addHighlight() {
	var page,
		category,
		media,
		name = null,
		callback;
	switch (arguments.length) {
		case 4:
			page = arguments[0];
			category = arguments[1];
			media = arguments[2];
			callback = arguments[3];
			break;
		case 5:
			page = arguments[0];
			category = arguments[1];
			media = arguments[2];
			name = arguments[3];
			callback = arguments[4];
			break;
	}

	let sql =
	'INSERT INTO Highlight(page, category, media, name) \
		VALUES(' + connection.escape(page) + ', ' + connection.escape(category) + ', ' + connection.escape(media) + ', ' + connection.escape(name) + ');';
	perform(sql, callback);
}

function addMedia() {
	var	url,
		contentType,
		text = null,
		callback;
	switch (arguments.length) {
		case 3:
			url = arguments[0];
			contentType = arguments[1];
			callback = arguments[2];
			break;
		case 4:
			url = arguments[0];
			contentType = arguments[1];
			text = arguments[2];
			callback = arguments[3];
			break;
	}

	let sql =
	'INSERT INTO Media(url, contentType, text) \
		VALUES(' + connection.escape(url) + ', ' + connection.escape(contentType) + ', ' + connection.escape(text) + ');';
	perform(sql, callback);
}

module.exports = {
	init,
	end,
	getAllPages,
	getAllCategories,
	getAllHighlights,
	getAllMedia,
	addPage,
	addCategory,
	addHighlight,
	addMedia,
	deleteAllPages,
	deleteAllCategories,
	deleteAllHighlights,
	deleteAllMedia,
	clearDatabase
};
