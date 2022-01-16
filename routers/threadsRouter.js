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
    
        await collection.updateOne(filter, update, function(err) {
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
    

    await connectDB();

    await collection.insertOne(newThread, function(err) {
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

    await collection.findOneAndDelete(filter, function(err) {
        if (err) {
            // 404 Not found
            res.sendStatus(404);
        } else {
            // 204 No Content
            res.sendStatus(204);
        }
    });
});

// TODO: Finde ud af hvor denne bliver kaldt fra
router.put('/api/threads/:threadId', async (req, res) => {

    const filter = { "threadId" : req.params.threadId };

    const updateThread = { $set: req.body }
    
    await connectDB();

    await collection.findOneAndUpdate(filter, updateThread, function(err) {
        if (err) {
            // 404 Not found
            res.sendStatus(404);
        } else {
            // 204 No Content
            res.sendStatus(204);
        }
     });
});

router.patch('/api/threads/editpost/', async (req, res) => {
    
    
    console.log("TCL: req", req.body.newContent)

    const filter = {};

    const update = { $set: { "posts.$[post].content": req.body.newContent, lastUpdatedAt: new Date().toLocaleString() } }
    
    const arrayFilter = { arrayFilters: [  { "post.postId": req.body.postId } ]};

    db.threads.findOneAndUpdate({}, { $set: { "posts.$[post].content": "AM er en lille EDIT" } }, { returnNewDocument: true, arrayFilters: [  { "post.postId": "bc8e51cd-ef39-481a-b55c-6c89ec4ad80a" } ]})

    await connectDB();


    //Updates the document 
    await collection.findOneAndUpdate(filter, update, arrayFilter, function(err) {
        if (err) {
            res.send({isEmpty: true});
            return;
        } 
    })
    
    // Finds and returns the specific post that was just updated
    const updatedPost = await collection.find({"posts.postId" : req.body.postId}, {"posts.$": 1}).toArray();


    // console.log("TCL: updatedPost", JSON.stringify(updatedPost, null, 4))
    
    res.send(updatedPost);
    
})

export default router;