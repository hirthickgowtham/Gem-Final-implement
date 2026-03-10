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

        const data = await AddGemDetails_Service.AddGemDetails_Service(gem_name,gem_division);
        console.log(data);
       

        const Gem_Id = data.data.gem_id;
        console.log("Gem Id received from microservice 1:", Gem_Id);

        for (const file of formattedFiles) {
            console.log("Uploading file:", file.fileName, "of type:", file.fileType);
            const response = await UploadMediaFilesAws(
              file.fileType,
              file.fileName,
              file.buffer
            );
            console.log("Response from S3 upload:", response);
          }
          
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