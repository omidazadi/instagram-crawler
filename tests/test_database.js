'use strict';
const db = require('../app_modules/database_interface.js');

function finish(callback) {
	db.clearDatabase((result, fields) => {
		db.end(() => {
			callback();
		});
	});
}

function testPage(callback) {
	db.addPage('therock', (result, fields) => {
		db.addPage('jordan.b.peterson', (result, fields) => {
			db.getAllPages((result, fields) => {
				console.log(result);
				callback(result, fields);
			});
		});
	});
}

function testCategory(callback) {
	db.addCategory('therock', 'Youtube', (result, fields) => {
		db.addCategory('jordan.b.peterson', 'Slay The Dragons', (result, fields) => {
			db.getAllCategories((result, fields) => {
				console.log(result);
				callback(result, fields);
			});
		});
	});
}

function testHighlight(callback) {
	db.getAllMedia((result, fields) => {
		let id1 = result[0].id,
			id2 = result[1].id;
		db.addHighlight('therock', 'Youtube', id1, (result, fields) => {
			db.addHighlight('therock', 'Youtube', id2, 'Gym Time', (result, fields) => {
				db.getAllHighlights((result, fields) => {
					console.log(result);
					callback(result, fields);
				});
			});
		});
	});
}

function testMedia(callback) {
	db.addMedia('https://www.storage.com/damkd', 'v', (result, fields) => {
		db.addMedia('https://www.storage.com/ioios', 'p', 'Look at this.', (result, fields) => {
			db.getAllMedia((result, fields) => {
				console.log(result);
				callback(result, fields);
			});
		});
	});
}

function init(callback) {
	db.init((result, fields) => {
		db.clearDatabase((result, fields) => {
			callback(result, fields);
		});
	});
}

function run(callback) {
	init((result, fields) => {
		testPage((result, fields) => {
			testCategory((result, fields) => {
				testMedia((result, fields) => {
					testHighlight((result, fields) => {
						finish(() => {
							callback();
						});
					});
				});
			});
		});
	});
}

run(() => {
});
