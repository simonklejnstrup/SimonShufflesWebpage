import express from 'express';
const router = express.Router();

import bcrypt from "bcrypt";
import { connectDB, db } from '../database/connectDB.js';


const collection = db.collection('users');

router.post("/msgboard/login", async (req, res) => {
    await connectDB()

    const filter = { "username" : req.body.username} ;
    
    

    const user = await collection.findOne(filter);

    if (user != null){
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (result) {

                //req.session.loggedIn = true; TODO: Skal rettes når jeg sætter SESSION på
                res.status(200).json({ "username" : user.username});
            } else {
                res.sendStatus(400)
            }
        });  
    }      
});




export default router;