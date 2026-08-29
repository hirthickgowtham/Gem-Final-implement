import { AddNewEachGem } from "../../services/Post/AddEachGem/AddEachGemDetails.service.js";

const AddEachGem = async (req, res) => {
  try {
    const {
      lot_number,
      description,
      crt,
      number_of_gems,
      gem_id,
      category,
      color_id,
      shape_id,
      price
    } = req.body;

    const gemDetails = {
      lot_number,
      description,
      crt: Number(crt),
      number_of_gems: Number(number_of_gems),
      gem_id: Number(gem_id),
      category: Number(category),
      color_id: Number(color_id),
      shape_id: Number(shape_id),
      price: Number(price)
    };

    console.log("Gem details to be added:", gemDetails);

    const result = await AddNewEachGem(gemDetails);
    const each_gem_id = result?.data?.each_gem_id;

    return res.status(201).json({
      status: true,
      message: result?.message || "Gem created successfully",
      each_gem_id,
      data: result?.data
    });

  } catch (error) {
    console.error("Error in AddEachGem controller:", error);

    const statusCode = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Internal Server Error";

    return res.status(statusCode).json({
      status: false,
      message: errorMessage
    });
  }
};

export default { AddEachGem };