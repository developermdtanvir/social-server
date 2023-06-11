const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
require('dotenv').config()
const port = process.env.PORT || 3000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gzw4htn.mongodb.net/?retryWrites=true&w=majority`

// middleware
app.use(cors());
app.use(express.json());

const server = http.createServer(app);



const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});




io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("send_notification", (data) => {
        io.emit("new_notification", data)
    })
});





const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})







async function run() {

    const postCollection = client.db('social').collection('post')
    const commentCollection = client.db('social').collection('comment')
    const saveCollection = client.db('social').collection('save')
    const reactCollection = client.db('social').collection('react')
    const profileCollection = client.db('social').collection('profile')

    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        console.log("Pinged your deployment. You successfully connected to MongoDB!");



        app.post('/post', async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post);
            res.send(result);

        })

        app.get('/posts', async (req, res) => {
            let queary = {};
            if (req.query.email) {
                queary = { email: req.query.email }
            }
            const cursor = await postCollection.find(queary)
            const result = await cursor.toArray();
            res.send(result);
        })

        app.delete('/posts/:id', async (req, res) => {
            const id = req.params.id;
            const queary = { _id: new ObjectId(id) }
            console.log(queary);
            const result = await postCollection.deleteOne(queary);
            res.send(result);
        })

        app.get('/post', async (req, res) => {
            const color = req.query.color
            let queary = { color: color }
            const cursor = await postCollection.find(queary)
            const result = await cursor.toArray();
            res.send(result);
        })

        app.patch('/post/:id', async (req, res) => {
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

        // app.post('/comment', async (req, res) => {
        //     const updateUser = req.body.commentdata;
        //     console.log(updateUser);
        // })

        app.post('/comment', async (req, res) => {

            const comment = req.body;
            const result = await commentCollection.insertOne(comment);
            res.send(result);
        })


        app.get('/comment/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const queary = { postId: id };
            const result = await commentCollection.find(queary).toArray();
            res.send(result);
        })

        app.post('/save', async (req, res) => {
            const saveInfo = req.body;
            const result = await saveCollection.insertOne(saveInfo);
            res.send(result);
        })

        app.get('/save', async (req, res) => {
            const queary = {};
            const result = await saveCollection.find(queary).toArray();
            res.send(result);
        })

        app.post('/react', async (req, res) => {
            const data = req.body;
            const result = await reactCollection.insertOne(data);
            res.send(result);
        })

        app.get('/react', async (req, res) => {
            const email = req.query.email;
            const queary = { reactUserEmail: email }
            const result = await reactCollection.find(queary).toArray()
            res.send(result);

        })
        app.post('/profile', async (req, res) => {
            const data = req.body;
            const result = await profileCollection.insertOne(data);
            res.send(result);
        })

        app.get('/profile', async (req, res) => {
            const email = req.query.email
            let queary = { email: email }
            const result = await profileCollection.findOne(queary)
            res.send(result);
        })

    } finally {
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('social media server is running')
})

server.listen(port, () => {
    console.log('listening on *:3000');
});