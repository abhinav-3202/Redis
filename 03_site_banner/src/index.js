import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// important thing is ki banner ke key kya rakhnege
// usually as per standard practice, we keep it in a constant file or sometimes called as enum file
// as for here only 1 file is there so we create here only 

const BANNER_KEY = 'app:banner';

app.post('/banner', async (req, res) => {
    await redis.set(BANNER_KEY, req.body.message || 'Welcome to our website!');
    res.json({ success : true  });
}); 

// redis.set , is used to set key value pair in redis

app.get('/banner', async (req, res) => {
    const message = await redis.get(BANNER_KEY);
    res.json({ message });
});
// for checking whether key aayi hai ya nhi 

app.delete('/banner', async (req, res) => {
    await redis.del(BANNER_KEY);
    res.json({ success: true });
});

// the below method checks whether the key exist in DB or not 
//here locally it will always exist but in production it may be possible that key is not there 

app.get('/banner/exist', async (req, res) => {
    const exists = await redis.exists(BANNER_KEY);
    res.json({exists : Boolean(exists) });
});

// if we send without Boolean it returns 0 or 1 but for cleaner resposne we put Boolean


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});