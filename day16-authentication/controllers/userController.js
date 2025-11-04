// // controllers/userController.js
// import User from "../models/userModel.js";
// import asyncHandler from "express-async-handler";
// import ErrorResponse from "../utils/errorResponse.js";

// export const getAllUsers = asyncHandler(async (req, res) => {
//   const users = await User.find().select("-password"); // hide passwords
//   res.json(users);
// });

// // ✅ Admin: Delete a user by ID
// export const deleteUser = asyncHandler(async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   if (!user) {
//     return next(new ErrorResponse("User not found", 404));
//   }

//   // prevent admin from deleting themselves accidentally
//   if (user._id.toString() === req.user._id.toString()) {
//     return next(new ErrorResponse("Admins cannot delete themselves", 400));
//   }

//   await user.deleteOne();
//   res.status(200).json({
//     success: true,
//     message: `User ${user.name} deleted successfully`,
//   });
// });
