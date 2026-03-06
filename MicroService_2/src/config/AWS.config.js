const { S3Client } = require("@aws-sdk/client-s3");

const bucket_name = process.env.BUCKET_NAME;
const bucket_region = process.env.BUCKET_REGION
const access_key = process.env.ACCESS_KEY;
const secrect_key = process.env.SECRECT_KEY;



const s3 = new S3Client(
    {
        credentials : {
            accessKeyId : access_key,
            secretAccessKey : secrect_key
        },
        region : bucket_region
    }
)


module.exports = {s3};