import RemoveEachGemService  from "../../services/Delete/RemoveSpecificGem.service.js";
import Get_EachGemDetails from "../../../PublicUserRoutes/services/EachGemDetail/EachGemDetail_BasedOn_id.service.js";
import DeleteMediaFilesAws from "../../../../utils/MediaFilesAws/DeleteMediaFilesAws.js";

const RemoveEachGem = async (req,res) => {
    try {
        const {each_gem_id} = req.body;
        if(!each_gem_id){
            return res.status(400).json({message:"each_gem_id is required"})
        }

        const eachGemDetails = await Get_EachGemDetails.Get_EachGemDetails(each_gem_id);
        console.log("Each Gem details fetched for deletion:", eachGemDetails.data.data[0].images);

        const theDetails  = eachGemDetails.data.data[0];

        const media_urls = [
            ...theDetails.images.map(img=>img.file),
            theDetails.video.file,
            theDetails.pdf.file
        ];

        console.log(media_urls);

        for(const file of media_urls){
            const res = await DeleteMediaFilesAws(file);
            console.log("Deleting media ",res)
        }
        

        // Call the service function to remove the gem
        const response = await RemoveEachGemService(each_gem_id);
        console.log("RemoveEachGem controller response:", response);
        
        // console.log(response);
        return res.status(200).json({
            message:"Gem removed successfully",
            response
        })

    } catch (error) {
        console.error("Error in RemoveEachGem controller:", error);
        return res.status(500).json({message:"Internal Server Error"});
    }       
}

export default {RemoveEachGem}
