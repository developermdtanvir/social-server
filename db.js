const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gzw4htn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connect() {
    try {
        await client.connect();
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}

const postCollection = client.db('social').collection('post');
const commentCollection = client.db('social').collection('comment');
const saveCollection = client.db('social').collection('save');
const reactCollection = client.db('social').collection('react');
const profileCollection = client.db('social').collection('profile');

module.exports = {
    connect,
    postCollection,
    commentCollection,
    saveCollection,
    reactCollection,
    profileCollection
};
