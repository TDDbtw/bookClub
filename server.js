require('dotenv').config(); 
const express = require("express")
const path = require("path")
const user = require("./routes/user")
const auth = require("./routes/auth")
const products = require("./routes/products")
const order = require("./routes/order")
const morgan = require("morgan")
const colors = require("colors")
const session = require("express-session")
const connectDB = require("./config/db")
const errorHandler = require(`./middleware/error`)
const Products = require("./models/products")
const User = require("./models/users")
const Offer = require("./models/offer")
const Subcategories = require("./models/subcategory")
const cookieParser = require("cookie-parser")
const categories = require("./routes/categories")
const admin = require("./routes/admin")
const cart = require("./routes/cart")
const asyncHandler = require("./middleware/async")
const jwt = require("jsonwebtoken")
const { paypal } = require("./utils/paypalConfig")

// Loading .env

//Connect to database
connectDB()

const app = express()
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.set("view engine", "pug")
app.set("views", __dirname + "/views")

// Serve static files from the public directory
app.use(express.static(__dirname + "/public"))
// app.use("/admin/public", express.static(path.join(__dirname, "public")))
app.use(express.static(__dirname + "/public/imgs"))

// dev loging middleware
if (process.env.NODE_ENV === `development`) {
  app.use(morgan(`dev`))
}

//mount routes
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate")
  res.setHeader("Pragma", "no-cache")
  res.setHeader("Expires", "-1")
  next()
})

// app.use("/users", users)
app.use("/auth", auth)
app.use("/products", products)
app.use("/category", categories)
app.use("/admin", admin)
app.use("/user", user)
app.use("/cart", cart)
app.use("/order", order)
app.get(
  "/",
  asyncHandler(async (req, res, next) => {
   let  products = await Products.find({status:true})
      .populate("category")
      .populate("subcategories")
      .exec()
products.forEach((item,index)=>{
item.discountedPrice=getDiscountedPrice(item)
})
console.log(`${products[0]}`)
    let user = ""
    console.log(req.cookies)
    if (req.cookies.jwt) {
      let decoded = jwt.verify(req.cookies.jwt, process.env.SECRET)
      user = await User.findById(decoded.userId).select("-password")

      res.render("./users/home", { products, user, })
    }
    else {
      res.render("./users/home", { products, user, })
    }
async function getDiscountedPrice(product) {
  let discountedPrice = product.price;

  if (product.offer) {
    try {
      const offer = await Offer.findById(product.offer._id);
      if (offer && offer.isActive()) {
        discountedPrice = offer.applyDiscount(product.price);
        console.log(`Discounted Price: ${discountedPrice}`.cyan);
        return discountedPrice
      }
    } catch (error) {
      console.error(`Error applying discount: ${error.message}`.red);
    }
  }

}
  })
)

app.use(errorHandler)

const PORT = process.env.PORT || 3001

const server = app.listen(
  PORT,
  console.log(
    `process running on ${process.env.NODE_ENV} at ${PORT}`.cyan.underline
  )
)

//  Handle unhandle promise Rejections ( instead of applying async await try catch directly on dbconnect)

process.on(`unhandledRejection`, (err, promise) => {
  console.log(
    `Error: 
Mongodb connection failed
${err.message}
  `.yellow
  )

  // close server and exit process

  server.close(() => process.exit(1))
})
