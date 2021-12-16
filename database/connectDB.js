import { MongoClient } from "mongodb";


const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const dbName = "simonshuffles";
export const db = client.db(dbName);
// const collection = db.collection("threads");



//const goldfish = await collection.insertOne({ type: "Goldfish"})

//const threads = await collection.find();


export async function connectDB() {
    return await client.connect();
};