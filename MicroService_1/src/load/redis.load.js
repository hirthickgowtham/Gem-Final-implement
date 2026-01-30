const redisClient = require('../config/redis.config'); // Import the redisClient


// Function to connect to Redis
const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    console.error("❌ Redis connection failed");
    console.error(err.message);
    process.exit(1);
  }
};


// Export the connectRedis function
module.exports = connectRedis;