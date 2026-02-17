import express from "express";

const route = express.Router();

import Get_gem_type_controller from "../controller/Get_gem_type.controller.js";

import Get_gem_list from "../controller/GemInventory.controller.js"
import Get_Single_Filter from "../controller/Single_Gem_Filter.controller.js"
import Get_Dobule_Filter from "../controller/Double_Gem_Filter.controller.js"
import Get_Three_Filter from "../controller/Three_Gem_Filter.controller.js"

import Get_SingleFilter_Count from "../controller/FilterCountController/Single_FilterCount.controller.js"
import Get_DoubleFilter_Count from "../controller/FilterCountController/Double_FilterCount.controller.js"
import Get_ThreeFilter_Count from "../controller/FilterCountController/Three_FilterCount.controller.js"

import Get_Shapetypes from "../controller/TypesOfShape.controller.js"
import Get_Colortypes from "../controller/TypesOfColor.controller.js"

import Get_EachGemDetailOnID from "../controller/EachGemDetail/EachGemDetail_BasedOn_id.controller.js"
import Get_EachGemDetailOnLotNumber from "../controller/EachGemDetail/EachGemDetail_BasedOn_LotNumber.controller.js"


//Get Gem Types
route.get("/get_gem_types",Get_gem_type_controller.gem_types)

//Get Gems based on Filter(WithoutFilter,Single,Double and Three)
route.get("/gem_List/:gem_id/:category",Get_gem_list.GemList)
route.get("/single_filter_gem/:gem_id/:category",Get_Single_Filter.Gem_SingleFilter)
route.get("/double_filter_gem/:gem_id/category_1/:filter1/:filter2",Get_Dobule_Filter.Gem_DoubleFilter)
route.get("/three_filter_gem/:gem_id/category_1",Get_Three_Filter.Gem_ThreeFilter)

//Filter Count
route.get("/single_filter_count/:gem_id/:category",Get_SingleFilter_Count.SingleFilter_Count)
route.get("/double_filter_count/:gem_id/category_1/:filter1/:filter2",Get_DoubleFilter_Count.DoubleFilter_Count)
route.get("/three_filter_count/:gem_id/category_1",Get_ThreeFilter_Count.ThreeFilter_Count)

//For Shape and color types
route.get("/shape_types",Get_Shapetypes.Gem_Shape)
route.get("/color_types",Get_Colortypes.Gem_ColorTypes)

//Get Each Gem details based on each_gem_id and lot number 
route.get("/each_gem_detail/based_on_id/:each_gem_id",Get_EachGemDetailOnID.GemDetail_id)
route.get("/each_gem_detail/based_on_lot_number/:lot_number",Get_EachGemDetailOnLotNumber.GemDetailOnLotNumber)


export default route;