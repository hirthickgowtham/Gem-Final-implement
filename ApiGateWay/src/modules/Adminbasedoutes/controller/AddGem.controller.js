import { AddNewGem } from "../services/AddGem.service.js";

const AddGem = async(req, res) => {
  // File handling Because we are using .fields()
  const images = req.files?.images || [];
  const video = req.files?.video || [];
  const pdf = req.files?.pdf || [];

  const allFiles = [...images, ...video, ...pdf];
  // console.log(allFiles);

  // const formattedFiles = allFiles.map(file => ({
  //   fileName: file.originalname,
  //   fileType: file.mimetype,
  //   buffer: file.buffer
  // }));
try{
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

  const result = await AddNewGem(gemDetails);

  const Each_Gem_Id = result.data.each_gem_id;

  console.log(Each_Gem_Id);

 //Still S3 file upload and updation of media table with each_gem_id  







  return res.status(200).json({
      message:"Gem created successfully",
      serviceRes:result
    })
  
}
catch(error){

    console.log("Message in APi controller ",error.message);
    return res.status(500).json({
      message: error,
      status:false
    });
}
  


 
  


  
};

export default { AddGem };