import express from 'express';
import Dummy from '../dummy';

const router = new express.Router();

/* delete. */
router.all('/', (req, res) => {
    const dummy = new Dummy('Delete');
    dummy.getData(res);
});

export default router;
