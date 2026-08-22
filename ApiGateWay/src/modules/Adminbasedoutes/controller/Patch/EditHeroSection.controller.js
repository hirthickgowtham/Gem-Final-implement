import UploadMediaFilesAws from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";
import DeleteMediaFilesAws from "../../../../utils/MediaFilesAws/DeleteMediaFilesAws.js";
import EditHeroSectionService from "../../services/Patch/EditHeroSection.service.js";
import RandomName from "../../../../utils/RandomName.js";



const EditHeroSection = async(req,res)=>{
    try {

    const { image_url, HeroId } = req.body;
    const image = req.file;

    if (!HeroId) {
      return res.status(400).json({
        message: "HeroId is required"
      });
    }

    const hasUpdates =
        req.body.title ||
        req.body.description ||
        req.body.image_url ||
        image;

    if (!hasUpdates) {
    return res.status(400).json({
        message: "At least one field is required to update"
    });
    }

    let data;

    if (image) {

      if (!image?.mimetype?.startsWith("image/")) {
        return res.status(400).json({
          message: "Only image files are allowed"
        });
      }

      if (!image_url || !image_url.trim()) {
        return res.status(400).json({
          message: "image_url is required"
        });
      }

      const filename = RandomName();

      const uploadResponse = await UploadMediaFilesAws(
        "image",
        filename,
        image.buffer
      );

      console.log(uploadResponse);

      data = await EditHeroSectionService({
        ...req.body,
        image_url: filename
      });

      const Delres = await DeleteMediaFilesAws(image_url);
      console.log(Delres);

    } 
    else {

      data = await EditHeroSectionService(req.body);
      console.log(data);

    }

    return res.status(200).json({
      message: "Hero section edited successfully",
      data
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


export default {EditHeroSection}