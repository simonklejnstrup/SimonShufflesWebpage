
import express from "express";
const app = express();
import session from "express-session";


app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "shhhhhhhhh",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
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


/* Configure server */
/* Configure server */
/* Configure server */

const PORT = process.env.PORT || 8080;

app.listen(PORT, (error) => {
    console.log("Server is running on", PORT);
});