import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../config/AWS.config.js";
import fs from "fs";

const DownloadMediaFilesAws = async (file_name, localPath) => {
    try {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: file_name
        };
        const command = new GetObjectCommand(params);
        const response = await s3.send(command);

        return new Promise((resolve, reject) => {
            const fileStream = fs.createWriteStream(localPath);
            response.Body.pipe(fileStream)
                .on("error", (err) => {
                    fileStream.close();
                    reject(err);
                })
                .on("close", () => {
                    resolve(localPath);
                });
        });
    } catch (error) {
        console.error("Error in DownloadMediaFilesAws:", error);
        throw error;
    }
};

export default DownloadMediaFilesAws;
