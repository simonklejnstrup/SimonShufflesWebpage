import express from 'express';
const router = express.Router();

import bcrypt from "bcrypt";
import { connectDB, db } from '../database/connectDB.js';

const collection = db.collection('users');

router.post('/auth/login', async (req, res) => {

    await connectDB()

    const filter = { 'username' : req.body.username} ;
    
    const user = await collection.findOne(filter);

    if (user === null){
        res.sendStatus(404);
    } else {
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (result) {
                req.session.isAdmin = user.isAdmin;
                req.session.username = user.username;
                req.session.userId = user.userId;
                req.session.isLoggedIn = true;
                res.sendStatus(200);
            } else {
                //401 Unauthorized
                res.sendStatus(401);
            }
        }); 
    }

     
});

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/msgboard')
})

router.get('/auth/username', (req, res) => {
    req.session.username ? res.send({ username: req.session.username }) : res.sendStatus(404); 
})

router.get('/auth/userId', (req, res) => {
    req.session.userId ? res.send({ userId: req.session.userId }) : res.send({ userId: false });
    
})

router.get('/auth/isAdmin', (req, res) => {
    res.send({ isAdmin: req.session.isAdmin});
})




export default router;