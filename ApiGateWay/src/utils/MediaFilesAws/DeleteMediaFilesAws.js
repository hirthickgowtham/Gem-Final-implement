import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../config/AWS.config.js";

const DeleteMediaFilesAws = async ( file_name ) => {
  try {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${file_name}`,
    };

    const command = new DeleteObjectCommand(params);
    return await s3.send(command);

  } catch (error) {
    console.log("Error in DeleteMediaFilesAws", error);
    throw error;
  }
};

export default DeleteMediaFilesAws;