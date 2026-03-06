const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { s3 } = require("../../config/AWS.config");

const DeleteMediaFilesAws = async ({ file_name, each_gem_id }) => {
  try {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${each_gem_id}/${file_name}`,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

  } catch (error) {
    console.log("Error in DeleteMediaFilesAws", error);
    throw error;
  }
};

module.exports = { DeleteMediaFilesAws };