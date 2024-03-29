import express from 'express';
import { connectDB, db } from '../database/connectDB.js';
import { v4 as uuidv4 } from 'uuid';
import { encrypt } from '../util/encryption.js';
import validator from 'validator';


const router = express.Router();
const collection = db.collection('users');

router.get('/api/users', async (req, res) => {
    await connectDB()
    const users = await collection.find().toArray();
    res.send(users);
});

router.get('/api/users/:userId', async (req, res) => {

    const filter = { "userId" : req.params.userId};

    const options = {
        // Exclude _id from the returned document
        projection: { _id: 0, username: 1, userId: 1 }, 
      };

    await connectDB()

    const user = await collection.findOne(filter, options);

    if (user === null){
        // 404 Not found
        res.sendStatus(404);
    } else {
        res.send(user);
    }   
});

router.get('/api/usersByUsername/:username', async (req, res) => {

    const filter = { "username" : req.params.username};

    const options = {
        // Exclude _id from the returned document
        projection: { _id: 0, username: 1, userId: 1, joinedAt: 1, postCount: 1 }, 
      };

    await connectDB()

    const user = await collection.findOne(filter, options);

    if (user === null){
        // 404 Not found
        res.sendStatus(404);
    } else {
        res.send(user);
    }   
});


router.post('/api/users', async (req, res) => {
    if ( validator.isEmpty(req.body.username, { ignore_whitespace: true }) 
        || validator.isEmpty(req.body.email, { ignore_whitespace: true }) 
        || validator.isEmpty(req.body.password, { ignore_whitespace: true }))
        {   //400 Bad request
            res.sendStatus(400);
            return
    }
    else if (!validator.isEmail(req.body.email)){
        //422 (Unprocessable Entity)
        res.sendStatus(422);
        return
    }
    const newUser = {};
    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.userId = uuidv4();
    newUser.joinedAt = new Date().toLocaleDateString();

    await encrypt(req.body.password)
        .then(encryptedPassword => { 
            newUser.password = encryptedPassword
        })
        .catch(err => console.log(err));

    await connectDB();

    await collection.insertOne(newUser, function(err){
        if (err) {
            if (err.code === 11000){
                //409 Conflict
                res.sendStatus(409)
                } else {
                // 500 Internal Server Error
                res.sendStatus(500)
                }
        } else {
            // 201 Created
            res.sendStatus(201);
        }
    });
});

router.delete('/api/users/:userId', async (req, res) => {

    const filter = { "userId" : req.params.userId };

    await connectDB;

    const user = await collection.findOneAndDelete(filter);

    if (user === null){
        // 404 Not found
        res.sendStatus(404);
    } else {
        res.send(user);
    } 

});

router.patch('/api/users/:userId', async (req, res) => {

    await connectDB;

    const filter =  { "userId" : req.params.userId };

    const update =  { $set: { "username" : req.body.username || '* No username *',
                             "email" : req.body.email || '* No email *' 
                            } 
                    } 

    const dbResponse = await collection.findOneAndUpdate(filter , update, { returnDocument: 'after' });

    res.send(dbResponse);
})

export async function incrementPostcount(username) {

    await connectDB();

    const filter = { username: username };

    const update = { $inc: { postCount: 1} };

    const dbResponse = await collection.updateOne(filter, update);

    return dbResponse;
}




export default router;