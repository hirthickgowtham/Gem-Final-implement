import axios from "axios";

const Get_GemDetailOnLotNumber = async (lot_number) => {
    try{
        const result = await axios.get(`${process.env.MICRO_SERVICE_1_URL}/api/each_gem_detail/based_on_lot_number/${lot_number}`);

        console.log(result.data);
        return result.data;
        
    }
    catch(error){

        return error;
    }
}

export default {Get_GemDetailOnLotNumber}