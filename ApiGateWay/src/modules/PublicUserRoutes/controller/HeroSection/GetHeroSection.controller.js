import HeroSectionService from "../../services/HeroSection/GetHeroSection.service.js"


const GetHeroSection = async (req,res) => {
    try {
        
        const response = await HeroSectionService.GetHeroSection();
        return res.status(200).json(response);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}

export default {GetHeroSection}