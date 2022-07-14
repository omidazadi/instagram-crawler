'use strict';
const axios = require('axios');
const tough = require('tough-cookie');
const Cookie = tough.Cookie;
const CookieJar = tough.CookieJar;
const nodeHtmlParser = require('node-html-parser');
const parse = nodeHtmlParser.parse;

const instagram = axios.create({
	baseURL: 'https://www.instagram.com',
	withCredentials: true,
	headers: {
		'user-agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0',
	},
});
const quera = axios.create({
	baseURL: 'https://www.quera.org',
	withCredentials: true,
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

function findCookie(cookies, name) {
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

/*quera({
	method: 'get',
	url: '',
})
	.then((response) => {
		handleCookies(response);
		let url = '/accounts/login';
		return quera({
			method: 'get',
			url: url,
			headers: {
				Cookies: jar.getCookieStringSync(quera.defaults.baseURL + url),
			},
		});
	})
	.then((response) => {
		handleCookies(response);
		const root = parse(response.data);
		let cmt = root.querySelector(`input[name='csrfmiddlewaretoken']`);
		console.log(cmt);
		let url = '/accounts/login';
		return quera({
			method: 'post',
			url: url,
			data: {
				login: 'haziseli@getmailet.com',
				password: 'youngsudden1111',
				csrfmiddlewaretoken: cmt._attrs.value,
			},
			headers: {
				Cookies: jar.getCookieStringSync(quera.defaults.baseURL + url),
			},
		});
	})
	.then((response) => {
		console.log(response);
	})
	.catch((err) => {
		console.log(err);
	});*/

instagram({
	method: 'get',
	url: '',
})
	.then((response) => {
		console.log('Status: ' + response.status);
		handleCookies(response);
		let url = '/accounts/login';
		let cookies = jar.getCookiesSync(instagram.defaults.baseURL + url);
		let csrfToken = findCookie(cookies, 'csrftoken').value;
		return instagram({
			method: 'get',
			url: url,
			headers: {
				Cookies: jar.getCookieStringSync(instagram.defaults.baseURL + url),
			},
		});
	})
	.then((response) => {
		console.log('Status: ' + response.status);
		handleCookies(response);
		let url = '/accounts/login/ajax/';
		let cookies = jar.getCookiesSync(instagram.defaults.baseURL + url);
		let csrfToken = findCookie(cookies, 'csrftoken').value;
		let loginData = {
			username: 'pooriabalenciaga',
			enc_password: `#PWD_INSTAGRAM_BROWSER:0:${Math.floor(Date.now() / 1000)}:zxcasdqwe123`,
			queryParams: '{}',
        		optIntoOneTap: 'false',
		};
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
		console.log('Status: ' + response.status);
		setUserId(response);
		handleCookies(response);
		let url = '/therock';
		let cookies = jar.getCookiesSync(instagram.defaults.baseURL + url);
		let csrfToken = findCookie(cookies, 'csrftoken').value;
		return instagram({
			method: 'get',
			url: url,
			headers: {
				Cookies: jar.getCookieStringSync(instagram.defaults.baseURL + url),
				'x-csrftoken': csrfToken,
			},
		});
	})
	.then((response) => {
		console.log('Status: ' + response.status);
		handleCookies(response);
		let url = '/accounts/logout/ajax/';
		let cookies = jar.getCookiesSync(instagram.defaults.baseURL + url);
		let csrfToken = findCookie(cookies, 'csrftoken').value;
		let userId = findCookie(cookies, 'ds_user_id').value;
		let logoutData = {
			one_tap_app_login: '0',
			user_id: userId,
		};
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
		});
	})
	.then((response) => {
		console.log(response);
	})
	.catch((err) => {
		console.log(err);
	});



