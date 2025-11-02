export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // ✅ allow access
  } else {
    res.status(403);
    throw new Error("Access denied. Admins only.");
  }
};
