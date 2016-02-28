import express from 'express';
import Dummy from '../dummy';

const router = new express.Router();

/* update. */
router.all('/', (req, res) => {
    const dummy = new Dummy('Update');
    dummy.getData(res);
});

export default router;
