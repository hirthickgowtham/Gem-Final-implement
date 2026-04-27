import UploadMediaFilesAws from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";
import EditGemDetailsService from "../../services/Patch/EditGemDetails.service.js";
import RandomName from "../../../../utils/RandomName.js";
import EditGemMedia_Service from "../../services/Post/AddGem/EditGemMedia.service.js";
import DeleteMediaFilesAws from "../../../../utils/MediaFilesAws/DeleteMediaFilesAws.js";

const Edit_Gem_Details = async(req,res)=>{  
    try {
        const { gem_id,media_url } = req.body;
        const Gemdetails = req.body;
        const image = req.file;


        const allowedFields = [
            'gem_name',
            'division'
        ];

        const hasGemUpdates = Object.keys(req.body).some(key =>
            allowedFields.includes(key)
        );

        
        if(!gem_id){
            return res.status(400).json({message:"Gem id is required"})
        }

        console.log("Gem details received in controller:", Gemdetails);

        if(image){
            console.log("Image file received in controller:", image);

            if(image.mimetype.split("/")[0] !== "image"){
                return res.status(400).json({message:"Only image files are allowed"})
            }

            if(!media_url){
                return res.status(400).json({message:"Media url is required when image is update defult gem image"})
            }

            console.log("Media URL received in controller:", media_url);

            const formatedFile = {
                filename:RandomName(),
                filetype:image.mimetype.split("/")[0],
                buffer:image.buffer
            }

            console.log(formatedFile);
            const NewFileresponse = await UploadMediaFilesAws(formatedFile.filetype,formatedFile.filename,formatedFile.buffer);
            console.log(NewFileresponse);

            const filename = formatedFile.filename;

            const Media_Response = await EditGemMedia_Service(gem_id, filename);
            
            console.log("Response from associating new media file with gem:", Media_Response);

            const deleteresponse = await DeleteMediaFilesAws(media_url)
            console.log("Response from deleting old media file from S3:", deleteresponse);



        }
        if(hasGemUpdates){
            const data = await EditGemDetailsService(Gemdetails);
            console.log("Gem details updated in database:", data);
        }
        else{
            console.log("No gem details to update, only media updated");
        }
        
        return res.status(200).json({
            message:"Gem details edited successfully",
            data : {
                gem_details_updated: hasGemUpdates ? true : false,
                media_updated: image ? true : false
            }
        })
    }
    catch (error) {
        console.error("Error in Edit_Gem_Details controller:", error);
        return res.status(500).json({
            message:"Internal server error in Edit_Gem_Details controller",
            error:error.message
        })
    }
}

export default {Edit_Gem_Details}