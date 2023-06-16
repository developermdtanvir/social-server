const express = require('express');

const router = express.Router();

const { postCollection } = require('../db')

router.post('/post', async (req, res) => {
    const post = req.body;
    const result = await postCollection.insertOne(post);
    res.send(result);

})

router.get('/', async (req, res) => {
    let queary = {};
    if (req.query.email) {
        queary = { email: req.query.email }
    }
    const cursor = await postCollection.find(queary)
    const result = await cursor.toArray();
    res.send(result);
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const queary = { _id: new ObjectId(id) }
    console.log(queary);
    const result = await postCollection.deleteOne(queary);
    res.send(result);
})

router.get('/', async (req, res) => {
    const color = req.query.color
    let queary = { color: color }
    const cursor = await postCollection.find(queary)
    const result = await cursor.toArray();
    res.send(result);
})

router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const email = req.query.email
    console.log(email)
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true }
    const updateDoc = {
        $set: {
            color: `text-green-600`,
            saveEmail: email
        },
    };
    const result = await postCollection.updateOne(filter, updateDoc, options);
    res.send(result);
})




module.exports = router;