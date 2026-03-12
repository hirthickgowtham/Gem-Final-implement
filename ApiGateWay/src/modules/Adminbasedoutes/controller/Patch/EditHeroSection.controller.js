import UploadMediaFilesAws from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";
import EditHeroSectionService from "../../services/Patch/EditHeroSection.service.js";



const EditHeroSection = async(req,res)=>{
    try {
        const {id} = req.body;
        const {title,description} = req.body;
        const {heroUrl} = req.body;
        const image = req.file;
        if(!id){
            return res.status(400).json({message:"id is required"})
        }

        console.log(id,title,description);
        console.log("Hero section edit route hit",heroUrl);
        
        if(image){
            if(image.mimetype.split("/")[0] !== "image"){
                return res.status(400).json({message:"Only image files are allowed for the hero section"})
            }
            if(!heroUrl){
                return res.status(400).json({message:"heroUrl is required when an image file is uploaded"})
            }
            const formatedFile = {
                filename: heroUrl,
                filetype: image.mimetype.split("/")[1],
                buffer: image.buffer
            }
            console.log(formatedFile);
            const response = await UploadMediaFilesAws(formatedFile.filetype,formatedFile.filename,formatedFile.buffer);
            console.log(response);
        }

        const data = await EditHeroSectionService(id,title,description);
        return res.status(200).json({
            message:"Hero section edited successfully",
            data
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

export default {EditHeroSection}