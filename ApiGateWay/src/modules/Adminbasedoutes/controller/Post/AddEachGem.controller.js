import { AddNewEachGem } from "../../services/Post/AddEachGem/AddEachGemDetails.service.js";
import AddEachGemMedia from "../../services/Post/AddEachGem/AddEachGemMedia.service.js";
import RandomName from "../../../../utils/RandomName.js";
import UploadMediaFilesAws from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";

const AddEachGem = async(req, res) => {


 console.log(req.files.length)

 const formattedFiles = req.files.map(file => ({
  fileName: RandomName(),
  fileType: file.mimetype,
  buffer: file.buffer
}));

// console.log(formattedFiles); 
 
try{
  //gem details from req body
  const gemDetails = {
     lot_number:req.body.lot_number,
    description:req.body.description,
    crt: Number(req.body.crt),
    number_of_gems: Number(req.body.number_of_gems),
    gem_id: Number(req.body.gem_id),
    category: Number(req.body.category),
    color_id: Number(req.body.color_id),
    shape_id: Number(req.body.shape_id)
  };
  console.log("Gem Details in controller",gemDetails);
  const result = await AddNewEachGem(gemDetails);

  //receiving each gem id from microservice 1
  const Each_Gem_Id = result.data.each_gem_id;
  console.log(Each_Gem_Id);

// Upload each file to AWS S3 
for (const file of formattedFiles) {
  console.log("Uploading file:", file.fileName, "of type:", file.fileType);
  const response = await UploadMediaFilesAws(
    file.fileType,
    file.fileName,
    file.buffer
  );

//confirmation log to check if file upload was successful
console.log("Response from S3 upload:", response);
}

//file names to array to be sent to microservice 2 for associating with Each Gem details in DB
const filenames = formattedFiles.map(file => {
  const type = file.fileType.split("/")[0];

  return {
    media_file: file.fileName,
    media_type: type === "application" ? file.fileType.split("/")[1] : type
  };
});

console.log("Filenames to be associated with Each Gem:", filenames);
console.log("Each Gem ID to be associated with files:", Each_Gem_Id);

//uploading data to microservice 2
const MediaUploadData = await AddEachGemMedia(Each_Gem_Id, filenames);
console.log("Response from AddEachGemMedia service:", MediaUploadData);

return res.status(200).json({
    message:"Gem created successfully",
    each_gem_id: Each_Gem_Id,
    MediaUploadData,
    serviceRes:result
    })
  
}
catch(error){

    console.log("Error in AddEachGem controller:",error.message);
    return res.status(500).json({
      message: error.message,
      status:false
    });
}
  
};

export default { AddEachGem };