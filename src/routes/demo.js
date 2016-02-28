import express from 'express';
const router = new express.Router();

/* demo. */
router.all('/', (req, res) => {
    const data = {
        success: 'success',
        type: 'demo'
    };
    res.json(data);
    res.end();
});

export default router;
