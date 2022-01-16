import express from "express";
const router = express.Router();
import { createPageWithoutSubnav, createPageWithSubnav } from '../util/render.js'


let threadId = '';


/* Ready the pages */
/* Ready the pages */
/* Ready the pages */

const frontpagePage = createPageWithoutSubnav("frontpage/frontpage.html", { 
    title: 'Simon Shuffles | Welcome'
});

const msgboardPage = createPageWithSubnav("msgboard/msgboard.html", { 
    title: 'Simon Shuffles | Messageboard',
    cssTag: '<link rel="stylesheet" href="../../pages/msgboard/msgboard.css">'
    
});

const signupPage = createPageWithSubnav("signuppage/signuppage.html", { 
    title: "Simon Shuffles | Sign Up",
    cssTag: '<link rel="stylesheet" href="../../pages/signuppage/signuppage.css">'
});

const adminPage = createPageWithSubnav("adminpage/adminpage.html", { 
    title: 'Simon Shuffles | Admin'
});

const createNewThreadPage = createPageWithSubnav("createnewthreadpage/createnewthreadpage.html", { 
    title: 'Simon Shuffles | Create New Thread'
});

const threadPage = createPageWithSubnav("threadpage/threadpage.html", { 
    title: 'Simon Shuffles | Thread',
    cssTag: '<link rel="stylesheet" href="../../pages/threadpage/threadpage.css">'
});


/* Serve endpoints */
/* Serve endpoints */
/* Serve endpoints */

router.get("/", (req, res) => {
    res.send(frontpagePage);
});

router.get("/msgboard", (req, res) => {
    res.send(msgboardPage);
});

router.get("/signup", (req, res) => {
    res.send(signupPage);
});

router.get("/admin", (req, res) => {
    res.send(adminPage);
});

router.get("/createnewthread", (req, res) => {
    res.send(createNewThreadPage);
});

router.get("/msgboard/thread/:threadId", async (req, res) => {

    //threadId = req.params.threadId;
    res.send(threadPage);
});



export default router;