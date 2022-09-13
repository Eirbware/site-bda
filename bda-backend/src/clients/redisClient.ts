import Redis from "ioredis";

// Configure the redis port and host
const redisPort: number = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379;
const redisHost: string = process.env.REDIS_HOST || 'localhost';

// Create a new redis client and connect to the redis server
const redisClient = new Redis(redisPort, redisHost, {
    password: process.env.REDIS_PASSWORD
});

// Handle the redis connection error and successful connection events
redisClient.on('error', console.error);
redisClient.on('connect', () => {
    console.log('[*] Redis client connected');
});

export default redisClient;