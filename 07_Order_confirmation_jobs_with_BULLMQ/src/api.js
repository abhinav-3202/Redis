import express from 'express';
import {emailQueue} from './queues.js'; 

const app = express();
app.use(express.json());

app.post('/welcome-email', async (req, res) => {
    const job = emailQueue.add(
        "send-welcome-email",
        {
            to: req.body.to,
            name: req.body.name || "Customer",
        },
        {
            attempts: 3, // retry mechanism
            backoff: {
                type: 'exponential',
                delay: 5000, // 5 seconds
            },
        }
    );
    res.json({message: "Welcome email job added to the queue", jobId: job.id});
});

// queue ke andar entry ke time spaces nhi dete , we use - 'hyphen' for that
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});