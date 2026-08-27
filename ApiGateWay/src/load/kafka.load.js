// Load Kafka producer configuration file for ApiGateWay
import { producer } from "../config/kafka.config.js";

async function loadKafka() {
  if (process.env.KAFKA_ENABLED !== "true") {
    console.log("ℹ️ Kafka is disabled (KAFKA_ENABLED != true). Skipping producer connection.");
    return;
  }

  try {
    console.log("Connecting to Kafka producer in ApiGateWay...");
    await producer.connect();
    console.log("✅ Kafka Producer connected successfully in ApiGateWay");
  } catch (error) {
    console.error("❌ Error loading Kafka Producer in ApiGateWay:", error.message || error);
  }
}

export default loadKafka;