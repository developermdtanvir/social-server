const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
    const saveInfo = req.body;
    const result = await saveCollection.insertOne(saveInfo);
    res.send(result);
})

router.get('/', async (req, res) => {
    const queary = {};
    const result = await saveCollection.find(queary).toArray();
    res.send(result);
})


module.exports = router;