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

function findCookie(url, name) {
	let cookies = jar.getCookiesSync(url, {allPaths: true,});
	for (let i = 0; i < cookies.length; i++) {
		if (cookies[i].key == name) {
			console.log(cookies[i]);
			return cookies[i];
		}
	}
}

function handleCookies(response) {
	let cookies = parseCookies(response.headers['set-cookie']);
	console.log(cookies, '\n----------------------------------------------\n');
	putInJar(cookies, response.config.baseURL + response.config.url);
}

quera({
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
	});

/*instagram({
	method: 'get',
	url: '',
})
	.then((response) => {
		handleCookies(response);
		let url = '/accounts/login';
		let cookies = jar.getCookiesSync(instagram.defaults.baseURL + url);
		return instagram({
			method: 'get',
			url: url,
			headers: {
				Cookie: bakeCookie(cookies),
			},
		});
	})
	.then((response) => {
		handleCookies(response);
		let url = '/accounts/login/ajax/';
		let cookies = jar.getCookiesSync(instagram.defaults.baseURL + url);
		return instagram({
			method: 'post',
			url: url,
			headers: {
				Cookie: bakeCookie(cookies),
			},
			data: {
				username: 'shiteater_balenciaga2',
				enc_password: '#PWD_INSTAGRAM_BROWSER:0:0:zxcasdqwe123',
			}
		});
	})
	.then((response) => {
		handleCookies(response);
		let url = '/therock';
		let cookies = jar.getCookiesSync(instagram.defaults.baseURL + url);
		return instagram({
			method: 'get',
			url: url,
			headers: {
				Cookie: bakeCookie(cookies),
			},
		});
	})
	.then((response) => {
		handleCookies(response);
		//console.log(response);
	})
	.catch((err) => {
		console.log(err);
	})*/
