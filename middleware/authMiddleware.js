const jwt = require("jsonwebtoken");
const User = require("../models/users");
const asyncHandler = require("../middleware/async");

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  
  if (!token) {
    return res.redirect("/auth/login");
  }
  console.log(`protect running`);
  const decoded = jwt.verify(token, process.env.SECRET);
  const user = await User.findById(decoded.userId).select("-password");
  
  if (!user) {
    return res.redirect("/auth/login");
  }
  
  // Check if user is blocked
  if (user.status === false) {
    return res.status(403).render("auth/errors/blocked.pug");
  }
  
  req.user = user;
  next();
});

// Admin middleware
const admin = (req, res, next) => {
  console.log(
    "User Role in Admin Middleware:",
    req.user ? req.user.role : "N/A"
  );
  if (req.user && req.user.role.toLowerCase() === "admin") {
    next();
  } else {
    console.log("Access Denied");
    return res.redirect("/");
  }
};

// User middleware
const user = (req, res, next) => {
  console.log(
    "User Role in User Middleware:",
    req.user ? req.user.role : "N/A"
  );
  if (req.user && req.user.role.toLowerCase() === "user") {
    next();
  } else {
    console.log("Access Denied");
    return res.redirect("/admin");
  }
};

module.exports = { protect, admin, user };
