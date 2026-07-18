// src/config/kafka.js
import { Kafka } from "kafkajs";

const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(",").map(b => b.trim()) : ["localhost:9092"];

const kafka = new Kafka({
    clientId: "media-service",
    brokers: brokers,
    retry: {
        initialRetryTime: 300,
        retries: 2
    }
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ 
    groupId: "video-processing-group-v2",
    sessionTimeout: 60000,
    heartbeatInterval: 10000,
    maxPollInterval: 900000
});

export default kafka;
