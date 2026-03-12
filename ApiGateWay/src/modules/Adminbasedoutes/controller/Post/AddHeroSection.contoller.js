import RandomName from "../../../../utils/RandomName.js";
import UploadMediaFilesAws from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";
import AddHeroSectionService from "../../services/Post/AddHeroSection.service.js";

const AddHeroSection = async (req,res)=>{
    try {
       

        const {title,des} = req.body;
        const file = req.file;

        console.log("file in controller",title,des,file);

        if(!title || !des || !file){
            return res.status(400).json({message:"All fields are required"})
        }
        const formatedFile = {
            filename:RandomName(),
            filetype:file.mimetype.split("/")[0],
            buffer:file.buffer
        }

        console.log(formatedFile);

        const filename = formatedFile.filename;
        console.log(filename);

        const response = await UploadMediaFilesAws(formatedFile.filetype,formatedFile.filename,formatedFile.buffer);
        console.log("response from aws",response);

        

        const data  = await AddHeroSectionService.Addherosection(title,des,filename);
        console.log("response from service",data);

        res.status(200).json({message:"data checking ", 
            response, 
            data
        })

    } catch (error) {
        console.log("Error in AddHeroSection controller",error);
        res.status(500).json({message:"Error in AddHeroSection controller",error:error.message})
    }
}

export default {AddHeroSection}