import express from 'express';
import Dummy from '../dummy';

const router = new express.Router();

/* create. */
router.all('/', (req, res) => {
    const dummy = new Dummy('Create');
    dummy.getData(res);
});

export default router;
