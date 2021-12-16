import express from 'express';
import { connectDB, db } from '../database/connectDB.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const collection = db.collection('threads');

router.get('/api/threads', async (req, res) => {
    await connectDB()
    const threads = await collection.find().toArray();
    res.send(threads);
});

router.get('/api/threads/:threadId', async (req, res) => {

    const filter = { "threadId" : req.params.threadId} ;

    const options = {
        // Exclude _id from the returned document
        projection: { _id: 0, msg: 1, threadId: 1 },
      };

    await connectDB()

    const thread = await collection.findOne(filter, options);

    if (thread === null){
        // 404 Not found
        res.sendStatus(404);
    } else {
        res.send(thread);
    }
      
});

router.post('/api/threads', async (req, res) => {
    const newThread = req.body;
    newThread.threadId = uuidv4();


    await connectDB();

    await collection.insertOne(newThread, function(err){
        if (err) {
            // 500 Internal Server Error
            res.sendStatus(500);
        } else {
            // 201 Created
            res.sendStatus(201);
        }
    });
});

router.delete('/api/threads/:threadId', async (req, res) => {

    const filter = { "threadId" : req.params.threadId };

    await connectDB();

    await collection.findOneAndDelete(filter, function(err){
        if (err) {
            // 404 Not found
            res.sendStatus(404);
        } else {
            // 204 No Content
            res.sendStatus(204);
        }
    });
});

router.put('/api/threads/:threadId', async (req, res) => {

    const filter = { "threadId" : req.params.threadId };

    const updateThread = { $set: req.body }
    
    await connectDB();

    await collection.findOneAndUpdate(filter, updateThread, function(err){
        if (err) {
            // 404 Not found
            res.sendStatus(404);
        } else {
            // 204 No Content
            res.sendStatus(204);
        }
     });
});

export default router;