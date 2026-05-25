import express from 'express';
import Redis from 'ioredis';
import mongoose from 'mongoose';

const app = express();

// ye redis ka client jitni jagah share karmna hai us hisab se create karna hai
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.get('/redis' ,async(req,res)=>{
    const reply = await redis.ping();
    res.json({message: reply});
});


app.get('/mongo' ,async(req,res)=>{
    const url = process.env.MONGO_URL || 'mongodb://localhost:27017/abhi_db';
    if(mongoose.connection.readyState === 0){
        await mongoose.connect(url);
    }   
    res.json({message:'connected' , database:mongoose.connection.db.databaseName}); 
})

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
}); 