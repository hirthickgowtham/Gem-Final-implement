import {s3} from "../config/AWS.config.js";
import { ListBucketsCommand } from "@aws-sdk/client-s3";


const AWSLoad = async () =>{
    try{
        const data = await s3.send(new ListBucketsCommand({}));
        if(!data || !data.Buckets){
            throw new Error("Unable to connect to AWS S3 or no buckets found");
        }
        console.log("✅ AWS Connection Successfull");
    }catch(error){
        console.log("❌AWS Connection Failed", error);
    }
}


export default AWSLoad;
