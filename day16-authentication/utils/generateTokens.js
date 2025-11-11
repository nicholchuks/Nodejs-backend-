import jwt from "jsonwebtoken";

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "15m", // Access token expires in 15 minutes
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d", // Refresh token expires in 7 days
  });
};
