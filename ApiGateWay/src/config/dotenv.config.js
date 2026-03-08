import dotenv from "dotenv";
dotenv.config();

console.log("Environment variables loaded:");
console.log("PORT:", process.env.PORT);
console.log("BUCKET NAME:", process.env.BUCKET_NAME);
console.log("BUCKET REGION:", process.env.BUCKET_REGION);
