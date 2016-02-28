import Exception from './exception';

const e = new Exception();

const readError = (err, _errMsg) => {
    let __err;
    if (err.msg) {
        __err = err;
    } else {
        __err = {
            msg: typeof err === 'string' ? err : _errMsg
        };
    }
    return e.printStackTrace(__err);
};

class ErrorHandler extends Exception {
    connectionError(err) {
        return readError(err, 'Error while creating connection.');
    }

    connectError(err) {
        return readError(err, 'Error while connecting.');
    }

    queryError(err) {
        return readError(err, 'Error while performing Query.');
    }
}

export default ErrorHandler;
