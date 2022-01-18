
import express from 'express';
const app = express();
import session from 'express-session';

import http from "http";
const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server);

const fifteenMinutes = 1000 * 60 * 15;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'shhhhhhhhh',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: fifteenMinutes },
    isLoggedin: false
}));



import threadsRouter from './routers/threadsRouter.js';
import pagesRouter from './routers/pagesRouter.js';
import usersRouter from './routers/usersRouter.js';
import loginRouter from './routers/loginRouter.js';
import adminRouter from './routers/adminRouter.js';

app.use(pagesRouter);
app.use(threadsRouter);
app.use(usersRouter);
app.use(loginRouter);
app.use(adminRouter);

// Socket.io
io.on('connection', (socket) => {
    console.log("A user connected: {id: ", socket.id, "}")
})

io.on('connection', socket => {
    socket.on('new-post',  newPost => {
        io.emit('new-post', newPost)

    })
})


/* Configure server */
/* Configure server */
/* Configure server */

const PORT = process.env.PORT || 8080;

server.listen(PORT, (error) => {
    console.log("Server is running on", PORT);
});