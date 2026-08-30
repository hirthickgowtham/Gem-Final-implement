import { Kafka } from "kafkajs";
import os from "os";

const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(",").map(b => b.trim()) : ["localhost:9092"];

// Dynamic unique clientId per instance/process with manual env override support
const clientId = process.env.KAFKA_CLIENT_ID || `media-consumer-${os.hostname()}-${process.pid}`;

const kafka = new Kafka({
    clientId: clientId,
    brokers: brokers,
    connectionTimeout: 10000,
    requestTimeout: 30000,
    retry: {
        initialRetryTime: 300,
        retries: 2
    }
});

const consumer = kafka.consumer({ 
    groupId: process.env.KAFKA_GROUP_ID || "video-processing-group-v2",
    sessionTimeout: 60000,
    heartbeatInterval: 3000,
    rebalanceTimeout: 60000,
    allowAutoTopicCreation: false,
    maxBytes: 10485760,
    maxBytesPerPartition: 1048576,
    minBytes: 1,
    maxWaitTimeInMs: 5000,
    readUncommitted: false
});

export { kafka, consumer };
export default kafka;
