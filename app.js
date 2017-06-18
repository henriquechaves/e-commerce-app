var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSession = require('express-session');
var busboy = require('connect-busboy');
var load = require('express-load');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(busboy());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('ecommerce'));
app.use(expressSession());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

var configurarBundle = require('./bundle');
configurarBundle(app);

var banco = require('./comum/banco');
new banco().iniciarConexao();

load('models')
	.then('schemas')
	.then('controllers')
	.then('routes')
	.into(app);

console.log('Variáveis configuradas', process.env.CLOUDINARY_API_KEY);

app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function (err, req, res, next) {
	console.log(err);
	if (req.xhr) {
		return;
	}

	if (err.status === 404) {
		return res.render('home/nao-encontrado');
	}

	res.status(err.status || 500);
	res.render('home/erro');
});

app.listen(process.env.PORT || 5000, function () {
	console.log("Sistema no no ar!");
});

module.exports = app;
