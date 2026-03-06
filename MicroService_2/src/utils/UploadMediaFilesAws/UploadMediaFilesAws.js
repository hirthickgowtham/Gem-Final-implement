const {PutObjectCommand} = require("aws-sdk/client-s3");
const {s3} = require("../../config/AWS.config");
 

const UploadMediaFilesAws = async ({file_type,file_name,each_gem_id,buffer}) =>{
    try{
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${each_gem_id}/${file_name}`,
            Body: buffer,
            ContentType: file_type
        };
        const command = new PutObjectCommand(params);
        await s3.send(command);
        
    }catch(error){
        console.log("Error in UploadMediaFilesAws", error);
        throw error;
    }
}