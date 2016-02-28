import express from 'express';
import { constants } from '../utils/constants';

const router = new express.Router();

router.all('/', (req, res) => {
    const data = {
        status: constants.SUCCESS,
        version: constants.API.VERSION
    };
    res.json(data);
});

// define the about route
router.get('/about', (req, res, next) => {
    next();
}, (req, res) => {
    const data = {
        status: constants.SUCCESS,
        version: constants.API.VERSION,
        about: constants.API.ABOUT
    };
    res.json(data);
});

export default router;
