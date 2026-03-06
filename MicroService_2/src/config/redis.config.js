const {createClient} = require('redis');// import createClient from redis package


// Create and configure the Redis client
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  password: process.env.REDIS_PASSWORD || undefined,
});


// Set up connect listener
redisClient.on("connect", () => {
  console.log("🟢 Redis connecting...");
});

// Set up ready listener
redisClient.on("ready", () => {
  console.log("✅ Redis connected");
});

// Set up error listener
redisClient.on("error", (err) => {
  console.error("🔴 Redis error", err);
});


// Export the configured redisClient
module.exports = redisClient;
