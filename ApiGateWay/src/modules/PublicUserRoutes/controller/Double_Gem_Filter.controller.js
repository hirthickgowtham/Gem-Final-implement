import DoubleFilter_Service from "../services/Double_Gem_Filter.service.js"

const Gem_DoubleFilter = async (req, res) => {

    const { gem_id, filter1, filter2 } = req.params;
    const { page = 1, limit = 10, value1, value2 } = req.query;
    
    // console.log(req.params,req.query);
    console.log("Controller 1");
    

    try {

        const data = await DoubleFilter_Service.Get_Gem_DoubleFilter(
            Number(gem_id),
            filter1,
            filter2,
            page,
            limit,
            value1,
            value2
        );
        // console.log(data);
        console.log("Controller 2");
        

        return res.status(200).json(data);

    } catch (error) {
        console.log("Controller error")

        return res.status(500).json({
            message: "Gateway Double Filter Error",
            error: error.message
        });
    }
};

export default {Gem_DoubleFilter}