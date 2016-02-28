import express from 'express';
import Dummy from './dummy';

const router = new express.Router();

/* demo. */
router.all('/', (req, res) => {
    const dummy = new Dummy('demo');
    dummy.getData(res);
});

export default router;
