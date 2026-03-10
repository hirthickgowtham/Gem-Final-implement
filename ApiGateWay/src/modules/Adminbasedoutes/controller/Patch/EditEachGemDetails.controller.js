import EditEachGemDetailsService from "../../services/Patch/EditEachGemDetails.service.js";
import UploadMediaFilesAws from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";

const Edit_Each_Gem_Details = async(req,res)=>{
    try{
        //Receiving the details to edit and media files if any and then uploading the media files to aws and then calling the service to edit the details in database
        const editDetails = req.body;
        const {media_file_name} = req.body;
        console.log(editDetails);

        //Data receiving should be like [{filename to change , file type and new buffer data},...]
        const mediaFileNames  = JSON.parse(media_file_name);
        console.log(mediaFileNames);
        
        if(req.files?.length > 0){
            if(mediaFileNames.length !== req.files.length){
                return res.status(400).json({
                    error:"Number of media file names and media files do not match"
                })
            }
            const files = req.files;
            console.log(files);

            const formatedFiles = files.map((file,index)=>{
                return {
                    filename: mediaFileNames[index],
                    filetype:file.mimetype.split("/")[0],
                    buffer:file.buffer
                }
            })
            console.log(formatedFiles);

            for(const file of formatedFiles){
                const response = await UploadMediaFilesAws(file.filetype,file.filename,file.buffer);
                console.log(response);
            }

        }

        const data = await EditEachGemDetailsService(editDetails);
        console.log(data);

        return res.status(200).json({
            message:data
            
        })

    }
    catch(error){
        return res.status(500).json({
            error:error.message
        })
    }
}

export default {Edit_Each_Gem_Details}