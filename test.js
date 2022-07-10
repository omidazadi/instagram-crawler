'use strict';
const axios = require('axios');
const tough = require('tough-cookie');
const Cookie = tough.Cookie;
const CookieJar = tough.CookieJar;
const fs = require('fs');

const instagram = axios.create({
	baseURL: 'https://www.instagram.com',
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

function omitBad(cookies) {
	let temp = [];
	for (let i = 0; i < cookies.length; i++) {
		if (cookies[i].maxAge > 0) {
			temp.push(cookies[i]);
		}
	}
	return temp;
}

function putInJar(cookies, url) {
	for (let i = 0; i < cookies.length; i++) {
		jar.setCookieSync(cookies[i], url);
	}
}

function bakeCookie(cookies) {
	let cookieString = '';
	for (let i = 0; i < cookies.length; i++)
	{
		cookieString += cookies[i].cookieString();
		if (i != cookies.length - 1) {
			cookieString += '; ';
		}
	}
	cookieString += ';';
	return cookieString;
}

function handleCookies(response) {
	let cookies = parseCookies(response.headers['set-cookie']);
	console.log(omitBad(cookies), '\n----------------------------------------------\n');
	putInJar(omitBad(cookies), response.config.baseURL + response.config.url);
}

instagram({
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
		console.log(response);
	})
	.catch((err) => {
		console.log(err);
	})
