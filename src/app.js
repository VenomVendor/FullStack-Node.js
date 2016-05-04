import bodyParser from 'body-parser';
import compression from 'compression';
import swig from 'swig';
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
import read from './routes/crud/read';
import update from './routes/crud/update';
import del from './routes/crud/delete';
import demo from './routes/demo';
import Hash from './utils/hash';
import { constants, strings as S } from './utils/constants';

const logDir = `${__dirname}/../logs/`;
const accessLog = 'access.log';
const loggerFormat = '[:date] [:method :status HTTP/:http-version] - :url';

const revision = `/${constants.API.REVISON}`;
const buildDir = path.join(__dirname, '../build');
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
    res.set('content-type', 'application/json');
    res.status(status);
    res.json(data);
    res.end();
};

/* *********** Express settings START ************** */

app.set('port', PORT);
// view engine setup
app.set('view engine', 'ejs');
app.set('view cache', false);
app.set('views', path.join(__dirname, 'views'));

swig.setDefaults({ cache: false });
app.engine('html', swig.renderFile);

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

app.use(express.static(path.join(buildDir, 'public')));
app.use('/js', express.static(path.join(buildDir, 'public', 'javascripts')));
app.use('/css', express.static(path.join(buildDir, 'public', 'stylesheets')));
app.use('/img', express.static(path.join(buildDir, 'public', 'images')));
app.use(favicon(path.join(buildDir, 'public', 'images', 'favicon.ico')));

app.use(logger(loggerFormat, { stream: accessLogStream }));
/* ************* SERVE STATIC END ***************** */

app.use(`${revision}/`, index);
app.use(`${revision}/post/`, post);
app.use(`${revision}/get/`, read);
app.use(`${revision}/update/`, update);
app.use(`${revision}/del/`, del);
app.use(`${revision}/demo/`, demo);

/* **************** ROUTING STARTS ***************** */

app.all(`${revision}/*.html`, (req, res) => {
    const fileName = path.basename(req.url);
    fs.stat(path.join(buildDir, 'public', 'htmls', fileName), err => {
        if (err === null) {
            res.render(path.join(buildDir, 'public', 'htmls', fileName), {
                title: `From ${fileName}`,
                hash: `-${Hash.short()}`
            });
        } else {
            res.render(path.join(buildDir, 'public', 'htmls', 'non-index.html'), {
                title: 'From non-index.html',
                hash: `-${Hash.short()}`
            });
        }
    });
});

app.all('/*.html', (req, res) => {
    res.redirect(301, `${revision}${req.url}`);
});

app.all(`${revision}/**/*`, (req, res) => {
    const url = req.url;
    res.status(404).render('error', {
        pageName: url
    });
});

app.all('/', (req, res) => {
    res.redirect(301, `${revision}/`);
});

/* **************** ROUTING ENDS ***************** */

/* ############### ERROR HANDLERS STARTS ############### */
// Handler for internal server errors - 500
const errorHandler = (err, req, res, next) => {
    if (app.get('env') === 'development') {
        console.error(err.message);
        console.error(err.stack);
    }
    sendError(req, res, 500);
    next();
};

// catch 404 and forward to error handler.
const notFound = (req, res, next) => {
    sendError(req, res, 404);
    next();
};

app.use(errorHandler);

// Should be added last.
app.use(notFound);
/* ############### ERROR HANDLERS END ############### */

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
        '\x1b[36m',
        `\n Server running at\thttp://${ipAddress}:${app.get('port')}\n`
    );
});

export default app;
