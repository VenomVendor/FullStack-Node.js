'use strict';

var constants = require('./utils/constants');
var _version = '/' + constants.API._VERSION;
//var async = require('async');
var bodyParser = require('body-parser');
var compression = require('compression');
var cons = require('consolidate');
var cookieParser = require('cookie-parser');
var express = require('express');
var favicon = require('serve-favicon');
var fs = require('fs');
var http = require('http');
var logger = require('morgan');
var multer = require('multer');
var path = require('path');
var responseTime = require('response-time');

var logDir = __dirname + '/../logs/';
var accessLog = 'access.log';
var loggerFormat = '[:date] [:method :status HTTP/:http-version] - :url';
var _dirname = path.join(__dirname, '../build');
var PORT = 3030;

/* current date */
logger.date = function() {
    return (new Date()).getTime();
};

Object.defineProperty(String.prototype, 'isEmpty', {
    value: function() {
        return this.length === 0;
    }
});

Object.defineProperty(String.prototype, 'isTooEmpty', {
    value: function() {
        return this.isEmpty() || this.trim().length === 0;
    }
});

/*##################################################
 ############### CONFIGURE API {START} ##############
 ###################################################*/

var index = require('./routes/index');
var get = require('./routes/read');
var demo = require('./routes/demo');

/*##################################################
 ############### CONFIGURE API {END} ################
 ###################################################*/

var app = express();

app.set('port', PORT);

app.set('view engine', 'ejs');
app.set('views', path.join(_dirname, 'views')); // view engine setup
app.engine('html', cons.swig);

var start = process.hrtime();

var sendError = function(req, res, status) {
    var callback = req.query.callback || null;
    var data = {
        status: constants.ERROR,
        message: http.STATUS_CODES[status] || constants.UNKNOWN_ERROR
    };
    if(callback) {
        data.callback = callback;
    }
    res.set('content-type');
    res.status(status);
    res.json(data);
    res.end();
};

var accessLogStream = fs.createWriteStream(logDir + accessLog, {
    flags: 'a'
});

app.use(logger(loggerFormat, {
    stream: accessLogStream
}));

app.use(logger('[:date] [:method :status HTTP/:http-version] - :url '));
app.use(express.static(path.join(_dirname, 'public')));
app.use(favicon(_dirname + '/public/images/favicon-mongo.ico'));

app.use(bodyParser.raw({ // parse some custom thing into a Buffer
    type: 'application/vnd.custom-type'
}));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.text({ // parse an HTML body into a string
    type: 'text/html'
}));

app.use(bodyParser.urlencoded({ // for parsing application/x-www-form-urlencoded
    extended: true
}));

app.use(cookieParser());
//app.use(multer()); // for parsing multipart/form-data
app.use(responseTime()); // detect Response time.
app.use(compression({
    level: 9
})); // compress responses.

console.log(process.hrtime(start));

/***************************************************
 ***************** SET API START ********************
 ****************************************************/
// insert this before your routes
app.use(function(req, res, next) {
    for (var key in req.query) {
        if(req.query.hasOwnProperty(key)) {
            req.query[key.toLowerCase()] = req.query[key];
        }
    }
    next();
});

app.use('/js', express.static(path.join(_dirname, 'public', 'javascripts')));
app.use('/css', express.static(path.join(_dirname, 'public', 'stylesheets')));
app.use('/img', express.static(path.join(_dirname, 'public', 'images')));
app.use('', express.static(path.join(_dirname, 'public', 'htmls')));

app.use(_version + '/', index);
app.use(_version + '/get/', get);
app.use(_version + '/demo/', demo);

/***************************************************
 ***************** SET API END **********************
 ****************************************************/

/*############### ERROR HANDLERS ###############*/
app.all('/:filename/', function(req, res) {
    res.redirect(301, _version + '/' + req.params.filename);
});

app.get(_version + '/ejs/*/*', function(req, res) {
    var path = req.url;
    res.render('error', {
        pageName: path
    });
});

app.get(_version + '/ejs/*', function(req, res) {
    var path = req.url;
    res.render('index', {
        pageName: path
    });
});

app.get(_version + '/:filename', function(req, res) {
    var fileName = req.params.filename;
    if(fileName.endsWith('.html')) {
        fs.stat(path.join(_dirname, 'public', 'htmls', fileName), function(err) {
            if(err === null) {
                res.sendFile(path.join(_dirname, 'public', 'htmls', fileName));
            } else {
                res.sendFile(path.join(_dirname, 'public', 'htmls', 'non-index.html'));
            }
        });
    } else {
        sendError(req, res, 404);
    }
});

// Handler for internal server errors
/*jshint unused: false, node: true */
app.use(function errorHandler(err, req, res, next) {
    if(app.get('env') === 'development') {
        console.error(err.message);
        console.error(err.stack);
    }
    sendError(req, res, 500);
});

// catch 404 and forward to error handler.
// Should be added last.
app.use(function notFound(req, res) {
    sendError(req, res, 404);
});

// Same as 404
// app.all('*', function (req, res) {
//     res.set('content-type');
//     var data = {
//         status: 'error',
//         message: 'Page Not Found.'
//     };
//     res.status(404);
//     res.json(data);
// });

/*############### ERROR HANDLERS ###############*/

module.exports = app;

var server = http.createServer(app);

server.listen(app.get('port'), function(err) {
    if(err) {
        throw err;
    }
    //var os = require('os');
    //var networkInterfaces = os.networkInterfaces();
    var ipAddress = 'localhost';
    console.log('\x1b[31m', '\n Server running at\thttp://' + ipAddress + ':' + app.get('port') + '\n');
});
