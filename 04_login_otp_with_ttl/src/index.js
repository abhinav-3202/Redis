// usually with otp related things we form a function that returns 
// a key which comes from a const file or another case if we want 
// key to be dynamic like we want to add some value in key , then we form 
// function only , (helper function/utility function) that returns the key

import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

function otpKey(phone){
    return `otp:${phone}`;
}

// next we will make a post method in which we will require phone no

app.post('/otp',async (req,res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // this will generate a random 6 digit number

    await redis.set(otpKey(phone),otp,'EX',30); // otp valid for 30 sec
    res.json({message : `OTP sent to ${phone}`,otp});
})

//next verify with redis only , so firstly check whether key is there or not because we keep the key for a short time 

app.post('/otp/verify',async (req,res) => {
    const { phone, otp } = req.body;
    const savedOtp = await redis.get(otpKey(phone));
    
    if(!savedOtp){
        return res.status(400).json({message : 'OTP expired or not found'});
    }

    if(savedOtp !== otp){
        return res.status(400).json({message : 'Invalid OTP'});
    }
    // validate the user by mongoDB then only delete

    await redis.del(otpKey(phone));
    res.json({message : 'OTP verified successfully'});
});

// for checking the ttl of a otp 
// whenever we store a key , then along with the key we store its metadata also 

app.get('/otp/:phone/ttl',async (req,res) => {
    const ttl = await redis.ttl(otpKey(req.params.phone));
    res.json({ttl});
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 