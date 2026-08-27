import { Kafka } from "kafkajs";

const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(",").map(b => b.trim()) : ["localhost:9092"];

const kafka = new Kafka({
    clientId: "media-service",
    brokers: brokers,
    connectionTimeout: 10000,
    requestTimeout: 30000,
    retry: {
        initialRetryTime: 300,
        retries: 2
    }
});

const consumer = kafka.consumer({ 
    groupId: "video-processing-group-v2",
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
