import GemDetailOnLotNumber_Service from "../../services/EachGemDetail/EachGemDetail_BasedOn_LotNumber.service.js"

const GemDetailOnLotNumber = async(req,res)=>{
    try{
        const lot_number = req.params.lot_number;
        const data = await GemDetailOnLotNumber_Service.Get_GemDetailOnLotNumber(lot_number);

        console.log("check in gem detail on lot number controller - api gateway");

        res.status(200).json(data);
        
    }
    catch(error){
        console.log("error in gem detail on lot number controller - api gateway ",error.message)
        res.status(500).json(error.message);

    }
}

export default {GemDetailOnLotNumber}