'use strict';
const views = require('./views.js');

function callView(request, data) {
	if (request.method == 'POST' && (request.url == '/login' || request.url == '/login/')) {
		return views.loginView(data);
	}
	else if (request.method == 'POST' && (request.url == '/logout' || request.url == '/logout/')) {
		return views.logoutView();
	}
	else if (request.method == 'GET' && (request.url.slice(0, 6) == '/fetch')) {
		return views.fetchView(request.url.slice(6, request.url.length));
	}
	else {
		return views.badView();
	}
}

module.exports = { callView };
