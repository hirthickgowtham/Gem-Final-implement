import axios from "axios";

const EditHeroSectionService = async(HeroEdit)=>{
    try {
        const response = await axios.patch(`${process.env.MICRO_SERVICE_2_URL}/api/hero_section/edit_hero_section`,
        HeroEdit,
        {
            headers:{
                "Content-Type":"application/json"
            }
        }
    )

    return response.data;
    
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default EditHeroSectionService;