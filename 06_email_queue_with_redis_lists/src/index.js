// in list of redis , left se entry hogi and right se pop hoga 
import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const QUEUE_KEY = "queue:emails";

// while making queue any entity that is kept in queue is called job 
app.post('/emails', async (req, res) => {
    const job = {
        to: req.body.to,
        subject: req.body.subject,
        body: req.body.body,
        createdAt: new Date().toISOString()
    }
    // most of the places we take hash only , keeping in session was a special case 
    await redis.lpush(QUEUE_KEY, JSON.stringify(job));
    res.json({queued: true , job});
});

app.get('/emails/process-one' , async (req, res) => {
    const rawJob = await redis.rpop(QUEUE_KEY);
    if(!rawJob){
        return res.json({message: "No jobs in the queue"});
    }
    const job = JSON.parse(rawJob);
    // simulate email sending , means we are assuming that email is sent successfully
    res.json({message: "Email sent successfully", job});
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
}); 

// What's the problem in this method is that 
// Job Loss
// No retry mechanism
// No Parallel workers