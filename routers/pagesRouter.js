import express from "express";
const router = express.Router();
import { createPage } from '../util/render.js'

/* Ready the pages */
/* Ready the pages */
/* Ready the pages */

const frontpagePage = createPage("frontpage/frontpage.html", { 
    title: "Simon Shuffles | Welcome"
});

const msgboardPage = createPage("msgboard/msgboard.html", { 
    title: "Simon Shuffles | Messageboard"
});

const signupPage = createPage("signuppage/signuppage.html", { 
    title: "Simon Shuffles | Sign Up"
});

const adminPage = createPage("adminpage/adminpage.html", { 
    title: "Simon Shuffles | Admin"
});


/* Serve endpoints */
/* Serve endpoints */
/* Serve endpoints */

// router.get("/", (req, res) => {
//     res.send(frontpagePage);
// });

router.get("/msgboard", (req, res) => {
    res.send(msgboardPage);
});

router.get("/signup", (req, res) => {
    res.send(signupPage);
});

router.get("/admin", (req, res) => {
    res.send(adminPage);
});



export default router;