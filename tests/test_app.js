'use strict';
const axios = require('axios');

axios({
	method: 'post',
	url: 'http://localhost:2001/login',
	data: {
		username: 'shiteater_balenciaga2',
		password: 'zxcasdqwe123',
	},
})
.then((response) => {
	console.log('here.');
	return new Promise((resolve, reject) => {
		setTimeout(resolve, 2000, response);
	});
})
/*.then((response) => {
	console.log('here.');
	return axios({
		method: 'post',
		url: 'http://localhost:2001/login',
		data: {
			username: 'shiteater_balenciaga2',
			password: 'zxcasdqwe1234',
		},
	})
})*/
.then((response) => {
	console.log('here.');
	return axios({
		method: 'get',
		url: 'http://localhost:2001/fetch/therock',
	})
})
.then((response) => {
	console.log('here.');
	return axios({
		method: 'post',
		url: 'http://localhost:2001/logout',
	})
})
.catch((err) => {
	console.log(err);
});
