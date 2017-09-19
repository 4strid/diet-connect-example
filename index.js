var path = require('path')
var server = require('diet')
var compatible = require('diet-connect');

// random assortment of middleware
var logger = require('morgan');
var createStatic = require('connect-static');
var session = require('express-session');
var SessionStore = require('express-nedb-session')(session);

function main () {
    var app = server()
	app.listen('http://localhost:8080')

	app.header(compatible(function (req, res, next) {
		console.log(req.url);
		next();
	}));

	app.header(compatible(logger('dev')));

	app.header(compatible(session({
		secret: 'mysecretkey',
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: (365 * 24 * 3600 * 1000) / 2
		},
		store: new SessionStore({filename: path.join(app.path, 'db','session.db')})
	})));

	// static middleware
	createStatic({
		dir: 'static',
		aliases: [['/','/index.html']]
	}, function (err, static) {
		app.footer(compatible(static));
	});

	app.get('/test', function ($) {
		if ($.session.views) {
			$.session.views++;
			$.end('' + $.session.views);
		} else {
			$.session.views = 1;
			$.end('welcome to the jungle');
		}
	});
}

module.exports = main

if (require.main === module) {
	main()
}
