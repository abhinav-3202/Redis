import Redis from 'ioredis';

const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

subscriber.subscribe('notifications', (err) => {
    if (err) {
        console.error('Failed to subscribe: %s', err.message);
        return;
    }
    console.log('Subscribed to notifications channel');
});

subscriber.on('message', (channel, message) => {
    // jo message aata h , wo string format me aata h , so usko parse karna h json me
    console.log("Recieved on " ,channel, ":" , JSON.parse(message)); 

});

// saare subscribers is tarah se listen kar skte h , or u can import this file in other and use 
