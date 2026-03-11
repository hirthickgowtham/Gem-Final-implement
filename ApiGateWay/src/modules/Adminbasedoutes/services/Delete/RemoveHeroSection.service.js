import axios from "axios";

const RemoveHeroSectionService = async(hero_section_id)=>{
    try {
        const response = await axios.delete(`${process.env.MICRO_SERVICE_2_URL}/api/hero_section/delete_hero_image`,{
            data:{
                HeroId : hero_section_id
            }
        });
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw new Error(error.response.data.message || "Failed to remove hero section");
    }
}

export default RemoveHeroSectionService;