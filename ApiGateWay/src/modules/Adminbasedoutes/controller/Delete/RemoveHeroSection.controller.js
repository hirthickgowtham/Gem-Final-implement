import RemoveHeroSectionService from "../../services/Delete/RemoveHeroSection.service.js";
import DeleteMediaFilesAws from "../../../../utils/MediaFilesAws/DeleteMediaFilesAws.js";

const RemoveHeroSection = async(req,res)=>{
    try {
        const {hero_section_id} = req.body;
        if(!hero_section_id){
            return res.status(400).json({message:"hero_section_id is required"})
        }

        const response = await RemoveHeroSectionService(hero_section_id);
        console.log(response.data[0].image_url);

        const Media_to_delete = response.data[0].image_url;

        const resfromaws = await DeleteMediaFilesAws(Media_to_delete);
        console.log(resfromaws);

        return res.status(200).json({
            message:"Remove Hero Section route working fine",
            response
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export default {RemoveHeroSection};
