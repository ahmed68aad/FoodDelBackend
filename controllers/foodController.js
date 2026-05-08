import foodModel from "../models/foodModel.js";
import fs from "fs";

//add food item

const addFood = async (request, response) => {
  try {
    const image_filename = request.file?.filename;
    if (!image_filename) {
      return response.json({
        success: false,
        message: "Image is required",
      });
    }

    const food = new foodModel({
      name: request.body.name,
      description: request.body.description,
      price: request.body.price,
      category: request.body.category,
      image: image_filename,
    });

    await food.save();

    return response.json({
      success: true,
      message: "Food added successfully",
    });
  } catch (error) {
    console.error("Error adding food:", error);

    return response.json({
      success: false,
      message: "An error occurred while adding the food",
    });
  }
};

const listfood = async (request, response) => {
  try {
    const foods = await foodModel.find({});
    response.json({
      success: true,
      data: foods,
    });
  } catch (error) {
    console.log(error),
      response.json({
        success: false,
        message: "Error",
      });
  }
};

//remov food item
const removefood = async (request, response) => {
  try {
    const food = await foodModel.findById(request.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(request.body.id);
    response.json({
      success: true,
      message: "food removed",
    });
  } catch (error) {
    console.log(error);
    response.json({
      success: false,
      message: "Error",
    });
  }
};

export { addFood, listfood, removefood };
