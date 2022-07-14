'use strict';
const http = require('http');
const urls = require('../app_modules/urls.js');

const server = http.createServer((req, res) => {
	let streamData = [];
	req.on('data', (chunk) => {
		streamData.push(chunk);
	});
	req.on('end', () => {
		let data;
		try {
			data = JSON.parse(streamData);
		}
		catch (err) {
			data = {};
		}
		
		urls.callView(req, data).then(() => {
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('Hello World!\n');
		});
	});
})

function runServer(port) {
	server.listen(port);
}

module.exports = { runServer };
