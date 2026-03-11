import EditEachGemDetailsService from "../../services/Patch/EditEachGemDetails.service.js";
import UploadMediaFilesAws from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";

const Edit_Each_Gem_Details = async(req,res)=>{
    try{
        //Receiving the details to edit and media files if any and then uploading the media files to aws and then calling the service to edit the details in database
        const editDetails = req.body;
        
        console.log(editDetails);

        
        
        
        
        if(req.file){
            console.log("Files received for edit each gem details:", req.file);
        }

        // const data = await EditEachGemDetailsService(editDetails);
        // console.log(data);

        return res.status(200).json({
            message:"data checking"
            
        })

    }
    catch(error){
        return res.status(500).json({
            error:error.message
        })
    }
}

export default {Edit_Each_Gem_Details}