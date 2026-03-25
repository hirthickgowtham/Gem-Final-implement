import EditEachGemDetailsService from "../../services/Patch/EditEachGemDetails.service.js";
import UploadMediaFilesAws from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";
import MapFilesAndData from "../../../../utils/MapFilesAndData.js";

const Edit_Each_Gem_Details = async(req,res)=>{
    try{
        //Receiving the details to edit and media files if any and then uploading the media files to aws and then calling the service to edit the details in database
        const editDetails = req.body;

        const {each_gem_id} = req.body;
        
        console.log(editDetails);
        if(!each_gem_id){
            return res.status(400).json({message:"each_gem_id is required"})
        }

        let fileData = {};
            if (req.body.FileData) {
                try {
                    fileData = JSON.parse(req.body.FileData);
                    console.log(fileData)
                } 
                catch (err) {
                    return res.status(400).json({ error: "Invalid FileData JSON" });
                }
            }

        
             const {images = [],videos = [],pdfs = []} = req.files || {};
            //  console.log(images,videos,pdfs)

            console.log(req.files)

            
                if((fileData.images?.length || 0) !== images.length){
                    return res.status(400).json({ error: "Images mismatch" });
                }
                
                if((fileData.videos?.length || 0) !== videos.length){
                    return res.status(400).json({ error: "Videos mismatch" });
                }
                
                 if((fileData.pdfs?.length || 0) !== pdfs.length){
                    return res.status(400).json({ error: "PDFs mismatch" });
                } 
        
                if(fileData.images && images.length === 0) {
                    return res.status(400).json({ error: "Images expected but not received" });
                }

                if (fileData.videos && videos.length === 0) {
                    return res.status(400).json({ error: "Videos expected but not received" });
                }
                
                if (fileData.pdfs && pdfs.length === 0) {
                    return res.status(400).json({ error: "PDFs expected but not received" });
                }

       
            const allFiles = MapFilesAndData.mapFilesForUpload(fileData, {
                images,
                videos,
                pdfs
            });

            console.log("Mapped Files:", allFiles);

            for (const file of allFiles) {
                console.log(`updating file ${file.key}`)
                const response = await UploadMediaFilesAws(
                    file.mimetype,
                    file.key,
                    file.buffer
                );

                console.log(response)
            }

        const data = await EditEachGemDetailsService(editDetails);
        console.log(data);

        return res.status(200).json({
            message:"data checking",
            data 
        })

    }
    catch(error){
        return res.status(500).json({
            error:error.message
        })
    }
}

export default {Edit_Each_Gem_Details}