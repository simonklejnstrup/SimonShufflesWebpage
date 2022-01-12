import express from 'express';
import { connectDB, db } from '../database/connectDB.js';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

const router = express.Router();
const collection = db.collection('threads');



router.get('/api/threads', async (req, res) => {
    await connectDB()
    const threads = await collection.find().toArray();
    res.send(threads);
});

router.get('/api/threads/:threadId', async (req, res) => {

    const filter = { "threadId" : req.params.threadId} ;

    await connectDB()

    const thread = await collection.findOne(filter);

    if (thread === null){
        // 404 Not found
        res.sendStatus(404);
    } else {
        res.send(thread);
    }
      
});

router.post('/api/threads/newpost/:threadId', async (req, res) => {

    if (!validator.isEmpty(req.body.content, { ignore_whitespace: true })) {
        const newPost = { postId: uuidv4(),
                          createdAt: new Date().toLocaleString(),
                          ...req.body
                        }
    
        await connectDB();

        const filter = { threadId: req.params.threadId };

        const update = { $push: { posts: newPost } };
    
        await collection.updateOne(filter, update, function(err){
            if (err) {
                // 500 Internal Server Error
                res.sendStatus(500);
            } else {
                // 201 Created
                res.sendStatus(201);
            }
        });
    }

});

router.post('/api/threads', async (req, res) => {

    const newThread = { threadId: uuidv4(), 
                        title: req.body.title,
                        posts: [{ postId: uuidv4(),
                                  createdAt: new Date().toLocaleString(),
                                  username: req.body.user,
                                  content: req.body.content,
                                }]
                        
                    }
    // newThread.threadId = uuidv4();
    // newThread.createdAt = new Date().toLocaleString();

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