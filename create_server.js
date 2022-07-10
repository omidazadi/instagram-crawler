'use strict';
const http = require('http');

const server = http.createServer((req, res) => {
	parseAndExecute(req, res)
})
server.listen(2001);
