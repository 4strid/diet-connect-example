var path = require('path')
var server = require('diet')
var compatible = require('diet-connect');


// random assortment of middleware
var logger = require('morgan');
var createStatic = require('connect-static'); // also works with express-static
var session = require('express-session');

var app = server()
app.listen('http://localhost:8080')

app.header(compatible(logger('dev')));

app.header(compatible(session({
	secret: 'mysecretkey',
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: (10 * 60 * 1000) / 2
	}
})));

// static middleware
createStatic({
	dir: 'static',
	aliases: [['/','/index.html']]
}, function (err, static) {
	app.footer(compatible(static));
});

// (taken from express session examples)
// refresh the page to see the counter go up
app.get('/counter', function ($) {
	if ($.session.views) {
		$.session.views++;
		$.end('you have viewed this page ' + $.session.views + ' times')
	} else {
		$.session.views = 1;
		$.end('you are viewing this page for the first time');
	}
});

app.get('/destroy', function ($) {
	$.session.destroy()
	$.end('counter is reset')
});
