'use strict';
const nodeHtmlParser = require('node-html-parser');
const fs = require('fs/promises');
const crawler = require('./crawler_handle.js');
const parse = nodeHtmlParser.parse;

function dfs(node) {
	if (node instanceof nodeHtmlParser.HTMLElement) {
		//console.log('Element: ', node.attributes);
	}
	for (let i = 0; i < node.childNodes.length; i++) {
		dfs(node.childNodes[i]);
	}
}

async function handleData(data) {
	try {
		let fileHandle = await fs.open('result.html', 'w');
		console.log('Opened the file.');
		await fileHandle.writeFile(data); 
		console.log('Wrote some data.');
		await fileHandle.close();
	}
	catch (err) {
		console.log(err);
	}
	
	let root = parse(data);
	dfs(root);
	console.log(data.slice(0, 10) + ' ...');
}

function logMessage(message) {
	console.log(message);
}

function loginView(credentials) {
	logMessage('Logging in...');
	let loginComplete;
	if (Object.keys(credentials).length == 0) {
		loginComplete = crawler.login();
	}
	else {
		loginComplete = crawler.login(credentials);
	}
	
	return loginComplete.then(({ status, data }) => {
		if (status == 200 && data.hasOwnProperty('status') && data.status == 'ok' && !data.hasOwnProperty('errors')) {
			if (data.authenticated) {
				logMessage('Successfully logged in!');
			}
			else {
				logMessage('Wrong username or password.');
			}
		}
		else {
			logMessage('Something went wrong. Login was not successful.');
		}
		
		return new Promise((resolve, reject) => {
			resolve();	
		});
	})
	.catch((err) => {
		console.log(err);
	});
}

function logoutView() {
	logMessage('Logging out...');
	return crawler.logout()
	.then(({ status, data }) => {
		if (status == 200 && data.hasOwnProperty('status') && data.status == 'ok') {
			logMessage('Logout compelete.');
		}
		else {
			logMessage('Something went wrong while logging out.');
		}
		
		return new Promise((resolve, reject) => {
			resolve();
		});
	})
	.catch((err) => {
		console.log(err);
	});
}

function fetchView(url) {
	logMessage('Fetching ' + url + ' ...');
	return crawler.fetchPage(url)
	.then(({ status, data }) => {
		if (status == 200) {
			logMessage('Fetch operation compelete.');
			handleData(data);
		}
		else {
			logMessage('Could not do the fetch due to errors.');
			
		}
		
		return new Promise((resolve, reject) => {
			resolve();
		});
	})
	.catch((err) => {
		console.log(err);
	});
}

function badView() {
	logMessage('Bad Request.');
	return new Promise((resolve, reject) => {
		resolve();
	});
}

module.exports = {
	loginView,
	logoutView,
	fetchView,
	badView,
};

