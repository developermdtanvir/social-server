const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
    const data = req.body;
    const result = await reactCollection.insertOne(data);
    res.send(result);
})

router.get('/', async (req, res) => {
    const email = req.query.email;
    const queary = { reactUserEmail: email }
    const result = await reactCollection.find(queary).toArray()
    res.send(result);

})


module.exports = router;