import dotenv from "dotenv";
dotenv.config();

console.log("Environment variables loaded for Kafka Consumer:");
console.log("KAFKA_BROKERS:", process.env.KAFKA_BROKERS || "localhost:9092");
console.log("BUCKET_NAME:", process.env.BUCKET_NAME);
console.log("BUCKET_REGION:", process.env.BUCKET_REGION);
console.log("MICRO_SERVICE_2_URL:", process.env.MICRO_SERVICE_2_URL);
