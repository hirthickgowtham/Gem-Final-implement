import "./config/dotenv.config.js";
import envLoad from "./load/env.load.js";
import AWSLoad from "./load/AWS.load.js";
import cleanupTempFiles from "./load/cleanup.load.js";
import loadKafka from "./load/kafka.load.js";
import { consumer } from "./config/kafka.config.js";

// 1. Validate environment configuration
envLoad();

// 2. Clean temporary residue folders
cleanupTempFiles();

// 3. Verify AWS S3 connection
await AWSLoad();

// 4. Start Kafka Consumer Loop
await loadKafka();

console.log("🚀 Standalone Kafka Consumer Service is running...");

// 5. Graceful shutdown handler
const shutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down Kafka Consumer gracefully...`);
  try {
    await consumer.disconnect();
    console.log("✅ Kafka Consumer disconnected cleanly.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during consumer disconnect:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
