import axios from "axios";

const GetHeroSection = async () => {
    try {
        const response = await axios.get(`${process.env.MICRO_SERVICE_1_URL}/api/hero_section/hero_images`);  
        console.log("Hero Section data:", response.data); // Log the response data for debugging
        return response.data;
    }
    catch(error){
        console.log(error);
        throw new Error("Failed to fetch hero section data");
    }
}

export default {GetHeroSection}