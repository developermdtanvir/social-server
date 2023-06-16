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

// import external router 

const profileRouter = require('./router/profileRouter');
const commentRouter = require('./router/commentRouter');
const reactRouter = require('./router/reactRouter');
const saveRouter = require('./router/saveRouter');
const postRouter = require('./router/postRouter')



app.use('/profile', profileRouter);
app.use('/comment', commentRouter);
app.use('/react', reactRouter);
app.use('/save', saveRouter);
app.use('/posts', postRouter);




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










app.get('/', (req, res) => {
    res.send('social media server is running')
})

server.listen(port, () => {
    console.log('listening on *:3000');
});