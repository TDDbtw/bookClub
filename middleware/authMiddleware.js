const jwt = require("jsonwebtoken")
const User = require("../models/users")
const asyncHandler = require("../middleware/async")

//protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token
  token = req.cookies.jwt
  if (token) {
    try {
      console.log(`protect running`)
      const decoded = jwt.verify(token, process.env.SECRET)
      const user = await User.findById(decoded.userId).select("-password")
      
      if (!user) {
        return res.status(401).render("auth/errors/401.pug")
      }

      // Check if user is blocked
      if (user.status === false) {
        return res.status(403).render("auth/errors/blocked.pug")
      }

      req.user = user
      next()
    } catch (error) {
      console.error(error)
      res.status(401).render("auth/errors/401.pug")
    }
  } else {
    res.status(401).render("auth/errors/401.pug")
  }
})

// admin middleware
const admin = (req, res, next) => {
  console.log(
    "User Role in Admin Middleware:",
    req.user ? req.user.role : "N/A"
  )

  if (req.user && req.user.role.toLowerCase() === "admin") {
    next()
  } else {
    console.log("Access Denied")
    res.status(403).render("auth/errors/403.pug")
  }
}

module.exports = { protect, admin }
