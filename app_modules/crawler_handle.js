'use strict';
const axios = require('axios');
const tough = require('tough-cookie');
const Cookie = tough.Cookie;
const CookieJar = tough.CookieJar;
const fs = require('fs');
const nodeHtmlParser = require('node-html-parser');
const parse = nodeHtmlParser.parse;

const instagram = axios.create({
	baseURL: 'https://www.instagram.com',
	withCredentials: true,
	headers: {
		'user-agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0',
	},
});
let jar = new CookieJar();

function parseCookies(headerSetCookie) {
	let cookies = [];
	if (headerSetCookie instanceof Array) {
		cookies = headerSetCookie.map(Cookie.parse);
	}
	else {
		cookies = [Cookie.parse(headerSetCookie)];
	}
	return cookies;
}

function putInJar(cookies, url) {
	for (let i = 0; i < cookies.length; i++) {
		if (cookies[i].TTL() != 0) {
			jar.setCookieSync(cookies[i], url);
		}
	}
}

function findCookie(name) {
	let cookies = jar.getCookiesSync(instagram.defaults.baseURL);
	for (let i = 0; i < cookies.length; i++) {
		if (cookies[i].key == name) {
			return cookies[i];
		}
	}
}

function handleCookies(response) {
	let cookies = parseCookies(response.headers['set-cookie']);
	putInJar(cookies, response.config.baseURL + response.config.url);
}

function setUserId(response) {
	let userId = response.data.userId;
	let loginCookie = new Cookie({
		key: 'ds_user_id',
		value: userId,
		maxAge: 'Infinity',
		domain: 'instagram.com',
		path: '/',
		secure: true,
	});
	jar.setCookieSync(loginCookie, instagram.defaults.baseURL);
}

function getCsrfToken() {
	return findCookie('csrftoken').value;
}

function getUserId() {
	return findCookie('ds_user_id').value;
}

function getLoginData() {
	return {
		username: 'pooriabalenciaga',
		enc_password: `#PWD_INSTAGRAM_BROWSER:0:${Math.floor(Date.now() / 1000)}:zxcasdqwe123`,
		queryParams: '{}',
		optIntoOneTap: 'false',
	};
}

function getLogoutData() {
	return {
		one_tap_app_login: '0',
		user_id: getUserId(),
	};
}

function logStatus(response) {
	console.log('Status: ' + response.status);
}

function logMessage(message) {
	console.log(message);
}

function logFetch(url) {
	console.log('Fetching ' + url);
}

function login() {
	logMessage('Logging in...');
	return instagram({
		method: 'get',
		url: '/accounts/login',
	})
	.then((response) => {
		logStatus(response);
		handleCookies(response);
		let url = '/accounts/login/ajax/';
		let csrfToken = getCsrfToken();
		let loginData = getLoginData();
		return instagram({
			method: 'post',
			url: url,
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
				Cookies: jar.getCookieStringSync(instagram.defaults.baseURL + url),
				'x-csrftoken': csrfToken,
				'x-requested-with': 'XMLHttpRequest',
			},
			data: new URLSearchParams(Object.entries(loginData)).toString(),
		});
	})
	.then((response) => {
		logStatus(response);
		logMessage('Successfully logged in!');
		handleCookies(response);
		setUserId(response);
		return new Promise((resolve, reject) => {
			resolve();
		});
	});
}

function logout() {
	logMessage('Logging out...');
	let url = '/accounts/login/ajax/';
	let csrfToken = getCsrfToken();
	let logoutData = getLogoutData();
	return instagram({
		method: 'post',
		url: url,
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			Cookie: jar.getCookieStringSync(instagram.defaults.baseURL + url),
			'x-csrftoken': csrfToken,
			'x-requested-with': 'XMLHttpRequest',
		},
		data: new URLSearchParams(Object.entries(logoutData)).toString(),
	})
	.then((response) => {
		logStatus(response);
		logMessage('Logout compelete.');
		return new Promise((resolve, reject) => {
			jar.removeAllCookies(resolve);
		});
	});
}

function fetchPage(url) {
	logFetch(url);
	let csrfToken = getCsrfToken();
	return instagram({
		method: 'get',
		url: url,
		headers: {
			Cookies: jar.getCookieStringSync(instagram.defaults.baseURL + url),
			'x-csrftoken': csrfToken,
		},
	})
	.then((response) => {
		logStatus(response);
		logMessage('Fetched the url.');
		handleCookies(response);
		return new Promise((resolve, reject) => {
			resolve(response.data);
		});
	});
}

module.exports = {
	login,
	logout,
	fetchPage,
};


