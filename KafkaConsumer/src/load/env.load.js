export default function envLoad() {
    const requiredEnv = ["BUCKET_NAME", "BUCKET_REGION", "ACCESS_KEY", "SECRECT_KEY", "MICRO_SERVICE_2_URL"];
    const missing = requiredEnv.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.warn(`⚠️ Warning: Missing environment variables in KafkaConsumer: ${missing.join(", ")}`);
    } else {
        console.log("✅ KafkaConsumer Environment variables verified");
    }
}
