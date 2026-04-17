import EditEachGemDetailsService from "../../services/Patch/EditEachGemDetails.service.js";
import EditEachGemMediaService from "../../services/Patch/EditEachGemMedia.service.js";
// import UploadMediaFilesAws from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";
import DeleteMediaFilesAws from "../../../../utils/MediaFilesAws/DeleteMediaFilesAws.js";
import {MapFilesAndData} from "../../../../utils/MapFilesAndData.js";


import uploadCategoryParallel from "../../../../utils/UploadHandler.js";

const Edit_Each_Gem_Details = async(req,res)=>{
    try{
        //Receiving the details to edit and media files if any and then uploading the media files to aws and then calling the service to edit the details in database
    const {each_gem_id} = req.body;
    if(!each_gem_id){
        return res.status(400).json({error:"Each Gem Id is required"});
    }

    const allowedFields = [
        'lot_number',
        'gem_id',
        'crt',
        'number_of_gems',
        'description',
        'category',
        'color_id',
        'shape_id'
    ];
    const hasGemUpdates = Object.keys(req.body).some(key =>
        allowedFields.includes(key)
    );
    console.log("🔹 Raw req.body:");
    console.log(req.body);

    console.log("🔹 Raw req.files:");
    console.log(req.files);

    // 🔹 Parse FileData safely
    let FileData = {};
    if (req.body.fileData) {
      try {
        FileData = JSON.parse(req.body.fileData);
      } catch (err) {
        return res.status(400).json({ error: "Invalid FileData JSON" });
      }
    }

    console.log("🔹 Parsed FileData:");
    console.log(FileData);

    const oldKeys = [];

    Object.keys(FileData).forEach((type) => {
    FileData[type].forEach((item) => {
        oldKeys.push(item.url);
    });
    });

    console.log("Old keys to delete:", oldKeys);

    const { images = [], videos = [], pdfs = [] } = req.files || {};

    const formattedData = {
    images: MapFilesAndData(FileData.images || [], images),
    videos: MapFilesAndData(FileData.videos || [], videos),
    pdfs: MapFilesAndData(FileData.pdfs || [], pdfs)
    };
   

    console.log("🔥 Formatted Data:", formattedData);

    const uploadResults = [
        ...(await uploadCategoryParallel(formattedData.images, "image")),
        ...(await uploadCategoryParallel(formattedData.videos, "video")),
        ...(await uploadCategoryParallel(formattedData.pdfs, "pdf"))
    ];

    console.log("uploaded : ", uploadResults);

    let mediaresult = null;

    if (uploadResults.length > 0) {
        mediaresult = await EditEachGemMediaService(uploadResults);
        console.log("Media edit result:", mediaresult);
    } else {
        console.log("No media files to update");
    }

    let gemDetailsResult = null;

    if (hasGemUpdates) {
        gemDetailsResult = await EditEachGemDetailsService(req.body);
        console.log("Gem details edit result:", gemDetailsResult);
    } else {
        console.log("No gem details to update, only media updated.");
    }

    for (const key of oldKeys) {
        const result = await DeleteMediaFilesAws(key);
        console.log(`Delete result for ${key}:`, result);
    }


    return res.status(200).json({
        success: true,
        mediaUpdated: uploadResults.length > 0,
        mediaresult,
        gemUpdated: hasGemUpdates,
        gemDetailsresult: hasGemUpdates ? gemDetailsResult : "No gem details updated"
    });

    }
    catch(error){
        console.log("Error in Edit Each Gem Details Controller", error);
        return res.status(500).json({
            error
        })
    }
}

export default {Edit_Each_Gem_Details}