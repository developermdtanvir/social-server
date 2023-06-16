const express = require('express');

const router = express.Router();

const { profileCollection } = require('../db')



router.post('/profile', async (req, res) => {
    const data = req.body;
    const result = await profileCollection.insertOne(data);
    res.send(result);
})




router.get('/', async (req, res) => {
    const email = req.query.email
    let queary = { email: email }
    const result = await profileCollection.findOne(queary)
    console.log(result)
    res.send(result);
})


module.exports = router;