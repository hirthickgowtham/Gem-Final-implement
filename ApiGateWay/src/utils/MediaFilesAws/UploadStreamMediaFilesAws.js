import { Upload } from "@aws-sdk/lib-storage";
import { s3 } from "../../config/AWS.config.js";

/**
 * Uploads a readable stream or buffer directly to AWS S3 using multipart streaming.
 * @param {string} file_type - The MIME type of the file
 * @param {string} file_name - The S3 object key
 * @param {import("stream").Readable | Buffer} streamOrBuffer - The readable stream or buffer to upload
 * @returns {Promise<import("@aws-sdk/lib-storage").CompleteMultipartUploadCommandOutput>}
 */
const UploadStreamMediaFilesAws = async (file_type, file_name, streamOrBuffer) => {
    try {
        const parallelUpload = new Upload({
            client: s3,
            params: {
                Bucket: process.env.BUCKET_NAME,
                Key: `${file_name}`,
                Body: streamOrBuffer,
                ContentType: file_type,
                CacheControl: "no-cache, no-store, must-revalidate"
            },
            queueSize: 4,
            partSize: 1024 * 1024 * 5, // 5MB chunks for S3 multipart
            leavePartsOnError: false
        });

        return await parallelUpload.done();
    } catch (error) {
        console.error("Error in UploadStreamMediaFilesAws:", error);
        throw error;
    }
};

export default UploadStreamMediaFilesAws;
