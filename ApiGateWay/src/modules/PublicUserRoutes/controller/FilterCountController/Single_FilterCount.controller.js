import SingleFilterCount_Service from "../../services/FilterCountService/Single_FilterCount.service.js";

const SingleFilter_Count = async (req,res) => {
    try{
        const gem_id = Number(req.params.gem_id);
        const category = Number(req.params.category);
        const { filter, value } = req.query;

        const data = await SingleFilterCount_Service.Get_SingleFilter_Count(gem_id,category,filter,value);

        console.log("Check in Single Filter count Controller - API gateway");
        
        console.log(data);

        res.status(200).json(data);
        
        
    }
    catch(error){
        console.log("Error Single Filter Count - API gateway ",error.message);
        res.status(500).json(error.message);
        
    }
}

export default {SingleFilter_Count}