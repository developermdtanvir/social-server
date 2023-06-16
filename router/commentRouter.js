const express = require('express');

const router = express.Router();

const { commentCollection } = require('../db')



router.post('/', async (req, res) => {
    const comment = req.body;
    const result = await commentCollection.insertOne(comment);
    res.send(result);
})


router.get('/:id', async (req, res) => {
    const id = req.params.id
    console.log(id);
    const queary = { postId: id };
    const result = await commentCollection.find(queary).toArray();
    res.send(result);
})

module.exports = router;