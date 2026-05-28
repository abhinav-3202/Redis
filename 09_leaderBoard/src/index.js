import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.post('/post/:id/view', async (req, res) => {
  const postId = req.params.id;
  await redis.incr(`post:${postId}:views`);
  res.sendStatus(200);
});
// incr auto increments by 1 every time a post is viewed
// leaderboard is implemented using a sorted set in Redis, where the score is the total views of a post and the member is the postId
app.post('/leaderboard/score',async (req, res) => {
    const { userId, score } = req.body;
    await redis.zincrby('leaderboard', score, userId);
    res.sendStatus(200);
})

app.get('/leaderboard', async (req, res) => {
    const top_10 = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');
    const leaderboard = [];
    // withscores returns an array of [userId1, score1, userId2, score2, ...]
    // so increment the loop by 2 to get the userId and score pairs
    for (let i = 0; i < top_10.length; i += 2) {
        leaderboard.push({ userId: top_10[i], score: parseInt(top_10[i + 1]) });
    }   
    res.json(leaderboard);
});

app.get('/leaderboard/:userId/rank', async (req, res) => {
    const userId = req.params.userId;
    const rank = await redis.zrevrank('leaderboard', userId);
    res.json({userId:userId,rank:rank+1});// zrevrank returns the rank starting from 0, so add 1 to get the actual rank
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// we can store the userprofile in a hashset in redis with the key as userId and the fields as name, email, etc.
//and retrieve the user profile using hgetall command in redis when needed.