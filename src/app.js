import bodyParser from 'body-parser';
import compression from 'compression';
import cons from 'consolidate';
import cookieParser from 'cookie-parser';
import express from 'express';
import favicon from 'serve-favicon';
import fs from 'fs';
import http from 'http';
import logger from 'morgan';
import path from 'path';
import responseTime from 'response-time';
import index from './routes/index';
import post from './routes/crud/create';
import get from './routes/crud/read';
import update from './routes/crud/update';
import del from './routes/crud/delete';
import demo from './routes/demo';
import { constants, strings as S } from './utils/constants';

const logDir = `${__dirname}/../logs/`;
const accessLog = 'access.log';
const loggerFormat = '[:date] [:method :status HTTP/:http-version] - :url';

const _version = `/${constants.API._VERSION}`;
const _dirname = path.join(__dirname, '../build');
const PORT = 3030;

/* current date */
logger.date = () => new Date().getTime();

const app = express();
const start = process.hrtime();
const accessLogStream = fs.createWriteStream(logDir + accessLog, {
    flags: 'a'
});
const sendError = (req, res, status) => {
    const callback = req.query.callback || null;
    const data = {
        status: constants.ERROR,
        message: http.STATUS_CODES[status] || S.UNKNOWN_ERROR
    };
    if (callback) {
        data.callback = callback;
    }
    res.set('content-type');
    res.status(status);
    res.json(data);
    res.end();
};

/* *********** Express settings START ************** */

app.set('port', PORT);
// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(_dirname, 'views'));
app.engine('html', cons.swig);

app.use(express.static(path.join(_dirname, 'public')));
app.use(favicon(`${_dirname}/public/images/favicon-mongo.ico`));
app.use(logger(loggerFormat, { stream: accessLogStream }));

// parse some custom thing into a Buffer
app.use(bodyParser.raw({
    type: 'application/vnd.custom-type'
}));

// for parsing application/json
app.use(bodyParser.json());

// parse an HTML body into a string
app.use(bodyParser.text({
    type: 'text/html'
}));

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());
// app.use(multer()); // for parsing multipart/form-data

// detect Response time.
app.use(responseTime());

// compress responses.
app.use(compression({
    level: 9
}));

/* *********** Express settings END ************** */

console.log(process.hrtime(start));

/* ************ SERVE STATIC START **************** */

app.use('/js', express.static(path.join(_dirname, 'public', 'javascripts')));
app.use('/css', express.static(path.join(_dirname, 'public', 'stylesheets')));
app.use('/img', express.static(path.join(_dirname, 'public', 'images')));
app.use('', express.static(path.join(_dirname, 'public', 'htmls')));

app.use(`${_version}/`, index);
app.use(`${_version}/post/`, post);
app.use(`${_version}/get/`, get);
app.use(`${_version}/update/`, update);
app.use(`${_version}/del/`, del);
app.use(`${_version}/demo/`, demo);

/* ************* SERVE STATIC END ***************** */

/* **************** ROUTING STARTS ***************** */

app.all('/:filename/', (req, res) => {
    res.redirect(301, `${_version}/${req.params.filename}`);
});

app.get(`${_version}/**/*`, (req, res) => {
    const url = req.url;
    res.status(404).render('error', {
        pageName: url
    });
});

app.get(`${_version}/:filename`, (req, res) => {
    const fileName = req.params.filename;
    if (fileName.endsWith('.html')) {
        fs.stat(path.join(_dirname, 'public', 'htmls', fileName), err => {
            if (err === null) {
                res.sendFile(path.join(_dirname, 'public', 'htmls', fileName));
            } else {
                res.sendFile(path.join(_dirname, 'public', 'htmls', 'non-index.html'));
            }
        });
    } else {
        const url = req.url;
        res.render('index', {
            pageName: url
        });
    }
});
/* **************** ROUTING ENDS ***************** */

/* ############### ERROR HANDLERS STARTS ############### */
// Handler for internal server errors
const errorHandler = (err, req, res, next) => {
    if (app.get('env') === 'development') {
        console.error(err.message);
        console.error(err.stack);
    }
    sendError(req, res, 500);
    next();
};

// catch 404 and forward to error handler.
const notFound = (req, res) => {
    sendError(req, res, 404);
};

app.use(errorHandler);

// Should be added last.
app.use(notFound);
/* ############### ERROR HANDLERS END ############### */

export default app;

/* ###############SERVER############### */
const server = http.createServer(app);

server.listen(app.get('port'), err => {
    if (err) {
        throw err;
    }
    // var os = require('os');
    // var networkInterfaces = os.networkInterfaces();
    const ipAddress = 'localhost';
    console.log(
        '\x1b[31m',
        `\n Server running at\thttp://${ipAddress}:${app.get('port')}\n`
    );
});
