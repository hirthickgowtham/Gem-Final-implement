import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../config/AWS.config.js";

const UploadMediaFilesAws = async (file_type, file_name, buffer) => {
    try {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${file_name}`,
            Body: buffer,
            ContentType: file_type,
            CacheControl: "no-cache, no-store, must-revalidate"
        };
        const command = new PutObjectCommand(params);
        return await s3.send(command);
    } catch (error) {
        console.error("Error in UploadMediaFilesAws:", error);
        throw error;
    }
};

export default UploadMediaFilesAws;
