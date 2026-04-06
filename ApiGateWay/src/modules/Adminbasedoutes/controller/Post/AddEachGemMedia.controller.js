import RandomName from "../../../../utils/RandomName.js";
import UploadMediaFilesAws  from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";
import AddEachGemMedia from "../../services/Post/AddEachGem/AddEachGemMedia.service.js";

const AddEachGemMediaController = async (req,res) => {
    const {each_gem_id} = req.body;

    if(!each_gem_id){
            return res.status(400).json({ error: "Each Gem ID is required" });
    }

    const receivedFiles = req.files;

    if (!Array.isArray(receivedFiles) || receivedFiles.length === 0){
            return res.status(400).json({ error: "No media files received for Each Gem" });
    }
    
    const formattedFiles = receivedFiles.map(file => ({
        fileName: RandomName(),
        fileType: file.mimetype,
        buffer: file.buffer
    }));

    console.log("Formatted files for Each Gem media upload:", formattedFiles);

    try{
        // Parallel upload
        const uploadResults = await Promise.all(
            formattedFiles.map(file =>
                UploadMediaFilesAws(file.fileType, file.fileName, file.buffer)
            )
        );

        console.log("Upload results for Each Gem media files:", uploadResults);

        const fileNames = formattedFiles.map(file => {
            const [type, subtype] = file.fileType.split("/");
            return {
                media_file: file.fileName,
                media_type: type === "application" ? subtype : type
            };
        });
        console.log("File names to be associated with Each Gem ID", each_gem_id, ":", fileNames);
         // Here you would typically call a service function to associate the uploaded media files with the Each Gem details in your database, using the each_gem_id and fileNames array.
         const associationResult = await AddEachGemMedia(each_gem_id, fileNames);
         
        console.log("Result of associating media files with Each Gem ID", each_gem_id, ":", associationResult);

         return res.status(200).json({ 
            message: "Media files uploaded and associated with Each Gem successfully" ,
            data: associationResult
         });
       

    }
    catch(error){
        console.log("Error in AddEachGemMedia controller",error);
        return res.status(500).json({ error: "Failed to add media for Each Gem" }); 
    }
}


export default AddEachGemMediaController;