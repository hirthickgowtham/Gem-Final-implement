import DoubleFilterCount_Service from "../../services/FilterCountService/Double_FilterCount.service.js"

const DoubleFilter_Count = async(req,res)=>
{
    try{
        const gem_id = Number(req.params.gem_id);
        const filter1 = req.params.filter1;
        const filter2 = req.params.filter2;
        const { value1, value2 } = req.query;

        const data = await DoubleFilterCount_Service.Get_DoubleFilter_Count(gem_id,filter1,filter2,value1,value2);

        console.log("check in double filter count controller - api gateway");
        console.log(data);

        res.status(200).json(data);
        
        
    }

    catch(error){
        console.log("Error in double filter count controller - api gateway ",error.message);
        res.status(500).json(error.message);
        
    }
}

export default {DoubleFilter_Count}