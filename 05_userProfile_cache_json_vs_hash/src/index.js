// set command -->store single variable // in here we cannot modify , the value gets deleted only 
// hset command --> store multiple object // here we can modify 
// hgetall command --> like getting the entire object

import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post('/user/:id/json', async (req, res) => {
    await redis.set(`user:${req.params.id}:json` , JSON.stringify(req.body));
    res.json({savedAs: "json"});
});

app.get('/user/:id/json', async (req, res) => {
    const raw = await redis.get(`user:${req.params.id}:json`);
    res.json({user:raw ? JSON.parse(raw) : null});
});
// in json above form we have passed the data after parseing into json but in DB it is stored in string only
// so in both methods there is a difference of architecture of how things are stored at the back
// but we keep this type of data in hash because we can modify the data without deleting the entire data
app.post("/user/:id/hash", async (req, res) => {
    await redis.hset(`user:${req.params.id}:hash`, req.body);
    res.json({savedAs: "hash"});
});

// getting the data from hash

app.get('/user/:id/hash', async (req, res) => {
    const user = await redis.hgetall(`user:${req.params.id}:hash`); 
    res.json({user})
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});