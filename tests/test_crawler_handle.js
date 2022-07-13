'use strict';
const crawler = require('../app_modules/crawler_handle.js');

crawler.login()
.then(() => {
	return crawler.fetchPage('/therock');
})
.then((data) => {
	console.log(data.slice(0, 10) + ' ...');
	return crawler.logout();
});
