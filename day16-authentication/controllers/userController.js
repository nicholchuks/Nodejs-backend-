// controllers/userController.js
import User from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password"); // hide passwords
  res.json(users);
};
