const createError = require('http-errors');
const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override')

const usersRouter = require('./controllers/users');

const app = express();

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

// DATABASE
require('./data/suprez-db');

// VIEWS
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/',
    partialsDir: [
        path.join(__dirname, 'views/partials')
    ]
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('X-HTTP-Method-Override'))

// BODY PARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

require('./controllers/index')(app);
require('./controllers/prezents')(app);
// app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// for heroku
const port = process.env.PORT || 5000;
app.listen(port);

module.exports = app;
