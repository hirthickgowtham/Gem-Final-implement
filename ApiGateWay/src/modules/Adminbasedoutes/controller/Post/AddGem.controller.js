import AddGemDetails_Service from "../../services/Post/AddGem/AddGemDetails.service.js";
import RandomName from "../../../../utils/RandomName.js"
import UploadMediaFilesAws from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";
import EditGemMedia_Service from "../../services/Post/AddGem/EditGemMedia.service.js";

const AddGem = async(req,res)=>{
    try{
        const {gem_name,gem_division} = req.body;
        console.log(req.files.length);
        console.log(gem_name);
        console.log(gem_division);

       const formattedFiles = req.files.map(file => ({
            fileName: RandomName(),
            fileType: file.mimetype.split("/")[0],
            buffer: file.buffer
        }));

        console.log(formattedFiles);

        // Start S3 uploads in parallel
        const s3UploadPromises = formattedFiles.map(file => {
            console.log("Starting upload of file:", file.fileName, "of type:", file.fileType);
            return UploadMediaFilesAws(
              file.fileType,
              file.fileName,
              file.buffer
            );
        });

        // Add Gem details in DB concurrently
        const dbGemPromise = AddGemDetails_Service.AddGemDetails_Service(gem_name,gem_division);

        const [_, data] = await Promise.all([
            Promise.all(s3UploadPromises),
            dbGemPromise
        ]);
        console.log(data);

        const Gem_Id = data.data.gem_id;
        console.log("Gem Id received from microservice 1:", Gem_Id);
          
        const media_files = formattedFiles.map(file => file.fileName);

        console.log("Media URLs:", media_files[0]);
        console.log("Media URLs:", Gem_Id);


          const Media_Response = await EditGemMedia_Service(Gem_Id, media_files[0]);

          console.log("Response from associating media files with gem:", Media_Response);

         return res.status(200).json({
            message:"Gem Added Successfully",
            data,
            Media_Response
        })
    }
    catch(error){
        console.log(error.message);

        return res.status(500).json({
            message: error.message,
            status:false
        });
    }
}

export default {AddGem}