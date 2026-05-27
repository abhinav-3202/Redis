import {Worker} from 'bullmq';
import {connection} from './queue.js';

// In worker file u have to pass 3 paroperties
// 1 . name of the queue 
// 2 . business logic , how to process the job
// 3 . connection details of redis

const emailWorker = new Worker(
    'emails',
    // here u can write the logic , maybe u are using resend or whatever write that 
    async (Job) => {
        console.log("Processing job", Job.id,Job.data,Job.name);
        await new Promise((resolve) => setTimeout(resolve, 1500)),
        console.log("Job completed", Job.id,Job.data,Job.name);
    },
    {connection}
)

// here we do not call these , there is mechanism for calling these functions 
// With worker we put listening events

worker.on('completed', (Job) => {
    console.log("Job completed event received for job", Job.id);
});

worker.on('failed', (Job, err) => {
    console.log("Job failed event received for job", Job.id, "Error:", err);
});

// Workers automatically listen for new jobs in the queue and process them as they arrive.