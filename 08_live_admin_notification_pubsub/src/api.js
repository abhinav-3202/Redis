import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.post("/notifications" , async (req, res) => {
    const payLoad = {
        title : req.body.title || "Default Title",
        createdAt : new Date().toISOString(),
    }

    const recievers = await publisher.publish("notifications", JSON.stringify(payLoad)); // publish karne ke baad hume ye pata chlega ki kitne subscribers ko message mila h
    // jab bhi data aayega ye recieve karke publishh karenge , har baar code nhi run karna h 
    res.json({
        message : `Notification sent to ${recievers} subscribers`,
        data : payLoad,
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});