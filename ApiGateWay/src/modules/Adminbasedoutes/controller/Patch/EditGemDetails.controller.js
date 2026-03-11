import UploadMediaFilesAws from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";
import EditGemDetailsService from "../../services/Patch/EditGemDetails.service.js";

const Edit_Gem_Details = async(req,res)=>{  
    try {
        const { gem_id,media_url } = req.body;
        const Gemdetails = req.body;
        const image = req.file;

        console.log("Gem details received in controller:", Gemdetails);
        if(!gem_id){
            return res.status(400).json({message:"Gem id is required"})
        }
        // if(Gemdetails.division !== "precious" || Gemdetails.division !== "semiprecious"){
        //     return res.status(400).json({message:"Division should only be precious or semiprecious"})
        // }
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
                filename:media_url,
                filetype:image.mimetype.split("/")[0],
                buffer:image.buffer
            }

            console.log(formatedFile);
            const response = await UploadMediaFilesAws(formatedFile.filetype,formatedFile.filename,formatedFile.buffer);
            console.log(response);
        }
        const data = await EditGemDetailsService(Gemdetails);

        console.log(data);



        return res.status(200).json({
            message:"Gem details edited successfully",
            data
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