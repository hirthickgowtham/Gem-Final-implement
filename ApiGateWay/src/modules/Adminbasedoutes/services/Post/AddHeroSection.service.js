import axios from "axios";

const Addherosection = async (title,description,image_url)=>{
    try {

        const response = await axios.post(`${process.env.MICRO_SERVICE_2_URL}/api/hero_section/add_hero_image`,{
            title,
            description,
            image_url
        },
        {
            headers:{
                "Content-Type":"application/json"
            }
        }
    )
        return response.data;
    }

        catch (error) {
        console.log("Error in AddHeroSection service",error.message);
        throw new Error(error.message || "Error in AddHeroSection service")
    }
}

export default {Addherosection}