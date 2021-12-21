import express from 'express';
const router = express.Router();

import bcrypt from "bcrypt";
import { connectDB, db } from '../database/connectDB.js';


const collection = db.collection('users');

router.post("/login", async (req, res) => {

    await connectDB()

    const filter = { "username" : req.body.username} ;
    
    const user = await collection.findOne(filter);

    //console.log(`User: ${user}, ReqBodyPass: ${req.body.password}`);

    if (user === null){
        res.sendStatus(404);
    } else {
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (result) {
                req.session.user = user;
                //res.sendStatus(200);
                res.status(200).json(user);
            } else {
                //401 Unauthorized
                res.sendStatus(401);
            }
        }); 
    }

     
});

router.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/msgboard")
})

router.get("/hasSession", (req, res) => {
    if (req.session.user){
        res.status(200).json(req.session.user)
    } else {
        res.sendStatus(404);
    }
})

export default router;