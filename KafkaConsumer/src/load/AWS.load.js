import { s3 } from "../config/AWS.config.js";
import { ListBucketsCommand } from "@aws-sdk/client-s3";

const AWSLoad = async () => {
    try {
        const data = await s3.send(new ListBucketsCommand({}));
        if (!data || !data.Buckets) {
            throw new Error("Unable to connect to AWS S3 or no buckets found");
        }
        console.log("✅ AWS S3 Connection Successful in KafkaConsumer");
    } catch (error) {
        console.error("❌ AWS Connection Failed in KafkaConsumer:", error.message || error);
    }
};

export default AWSLoad;
