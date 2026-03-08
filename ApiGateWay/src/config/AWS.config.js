import { S3Client } from "@aws-sdk/client-s3"; 

const bucket_name = process.env.BUCKET_NAME;
const bucket_region = process.env.BUCKET_REGION
const access_key = process.env.ACCESS_KEY;
const secrect_key = process.env.SECRECT_KEY;

console.log("AWS Config Loaded with bucket:", bucket_name, "region:", bucket_region);
console.log("AWS Access Key:", access_key ? "Loaded" : "Not Loaded");
console.log("AWS Secret Key:", secrect_key ? "Loaded" : "Not Loaded");

const s3 = new S3Client(
    {
        credentials : {
            accessKeyId : access_key,
            secretAccessKey : secrect_key
        },
        region : bucket_region
    }
)


export {s3};