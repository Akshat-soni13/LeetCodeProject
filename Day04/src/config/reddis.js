const{ createClient }= require('redis');

const RedisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-14687.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 14687
    }
});

module.exports= RedisClient;