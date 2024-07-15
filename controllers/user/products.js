const Products = require("../../models/products")
const Cart = require("../../models/cart")
const User = require("../../models/users")
const Offer = require("../../models/offer")
const Wishlist = require("../../models/wishlist")
const Categories = require("../../models/category")
const Subcategories = require("../../models/subcategory")
const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")
const jwt = require("jsonwebtoken")
const colors = require("colors")
let userVar = ""



const getProductsTwo=asyncHandler(async (req, res, next) => {

  const searchTerm = req.query.search;
  const categoryFilter = req.query.category;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const skip = (page - 1) * limit;
  const query = {};

  if (searchTerm) {
    // Search by title or author
    query.$or = [
      { title: { $regex: searchTerm, $options: "i" } },
      { author: { $regex: searchTerm, $options: "i" } },
    ];
  }

  if (categoryFilter) {
    // Find products belonging to the selected category 
    query.Category = categoryFilter; 
  }

  const products = await Products.find(query)
    .populate("Category", "name") // Populate only the category name
    .populate("subcategories", "name") // Populate subcategory names
    .skip(skip)
    .limit(limit);

  const totalProducts = await Products.countDocuments(query);

  res.json({
    products,
    currentPage: page,
    totalPages: Math.ceil(totalProducts / limit),


  })
});












const loadproducts = asyncHandler(async (req, res, next) => {
  const products = await Products.find()
    .populate("category", "name") // Populate category name
    .populate("subcategories", "name") // Populate subcategory names
    .exec();

  const categories = await Categories.find();
  const subcategories = await Subcategories.find()
    .populate("category", "name") // Populate category name in subcategories
    .exec();

  // ... (your logic for handling user and cookies) ...

    if (req.cookies.jwt != "") {
      let decoded = jwt.verify(req.cookies.jwt, process.env.SECRET)
      req.user = await User.findById(decoded.userId).select("-password")
      let user = req.user
      userVar = user
    } else {
      let user = null
      userVar = user
    }


  res.render("./users/shop", {
    products,
    user:userVar,
    categories,
    subcategories,
  });
}); 

const createProduct = asyncHandler(async (req, res, next) => {
  console.log(JSON.stringify(req.body))
  res.json(req.body)
})
const loadCreateProduct = asyncHandler(async (req, res, next) => {
  const categories = await Categories.find()
  console.log(categories)
  const subcategories = await Subcategories.find()
  categories.forEach((element) => {
    subcategories.push(element.subcategories)
  })
  // console.log(subcategories)
  res.render("./admin/createProduct", {
    categories,
    subcategories,
    name: "Create Product",
  })
})
// @desc     Get all products
// @route    GET /products
// @access   private
const getProducts = asyncHandler(async (req, res, next) => {
  // Building the query based on the request query parameters
  let queryStr = JSON.stringify(req.query)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)
  const query = Products.find(JSON.parse(queryStr))

  // Executing the query
  const products = await query

  // Sending JSON response
  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  })
})

// @desc     Get single product
// @route    GET /products/:id
// @access   public
const getProduct = asyncHandler(async (req, res, next) => {
  // Fetch product with populated fields
  const product = await Products.findById(req.params.id)
    .populate("category", "name")
    .populate("subcategories", "name")
    .exec();

  if (!product) {
    return next(
      new ErrorResponse(
        `Product not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  // Handle user authentication
  let user = null;
  if (req.cookies.jwt) {
    try {
      const decoded = jwt.verify(req.cookies.jwt, process.env.SECRET);
      user = await User.findById(decoded.userId).select("-password");
    } catch (error) {
      console.error("Error verifying JWT:", error);
    }
  }

  // Fetch wishlist status
  let ifItem = false;
  if (user) {
    const wishlist = await Wishlist.findOne({ user: user._id });
    ifItem = wishlist ? wishlist.items.some(item => item.product.equals(req.params.id)) : false;
  }

  // Fetch offers for this product and its category
  const productOffers = await Offer.findOffersByProduct(product._id);
  const categoryOffers = await Offer.findOffersByCategory(product.category._id);

  // Combine and filter offers
  const allOffers = [...productOffers, ...categoryOffers].filter(offer => offer.isValid());

  // Calculate best offer and final price
  let bestOffer = null;
  let finalPrice = product.price;

  allOffers.forEach(offer => {
    const discountedPrice = offer.calculateDiscountedPrice(product.price);
    if (discountedPrice < finalPrice) {
      finalPrice = discountedPrice;
      bestOffer = offer;
    }
  });

  // Calculate discount percentage
  const discountPercentage = bestOffer ? 
    Math.round((1 - finalPrice / product.price) * 100) : 0;

  // Prepare data for rendering
  const productData = {
    ...product.toObject(),
    finalPrice,
    discountPercentage,
    offers: allOffers.map(offer => ({
      ...offer.toObject(),
      remainingTime: offer.remainingTime,
      isBestOffer: offer._id.equals(bestOffer?._id)
    })),
    bestOffer: bestOffer ? {
      ...bestOffer.toObject(),
      remainingTime: bestOffer.remainingTime } : null
  };

  res.render("./users/PDP.pug", { 
    product: productData, 
    user,
    ifItem
  });
});



//  @desc     POST Create product
//  @routes post/products/
  //  @access private

//  @desc     Delete one product
//  @routes delete /products/:id/delete
  //  @access private

const loadupload = asyncHandler(async (req, res, next) => {
  const products = await Products.find(images)
  res.render("uploadImage", { images })
})
const uploadImages = asyncHandler(async (req, res) => {
  await upload(req, res, function (err) {
    console.log(`images uploaded successfully`.green.inverse)
    // At this point, the files are uploaded, and you can save the file paths or URLs in your MongoDB document
    const imagePaths = req.files.map(
      (file) => `http://localhost:3001/uploads/${file.filename}`
    )
    // Save the imagePaths in your MongoDB document

    res.json({ imagePaths: imagePaths })
  })
})


// search sort filter


const onetwo = asyncHandler(async (req, res, next) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 3;

    // Search and sorting parameters
    const search = req.query.search || "";
    const subCat = req.query.subCat || "All";

    // Sorting options
    const sortOptions = {
      lowToHigh: { price: 'asc' },
      highToLow: { price: 'desc' },
      aToZ: { name: 'asc' },
      zToA: { name: 'desc' }
    };
    const sort = sortOptions[req.query.sort] || { rating: 'asc' };

    // Fetch all subcategories and map their IDs
    const subcategories = await Subcategories.find().populate("category").exec();
    let subCatOptions = subcategories.map(item => item._id.toString());

    // Determine the subcategories to filter by
    const subCategories = subCat === "All" ? subCatOptions : subCat.split(",");

    // Fetch filtered and sorted products
    let products = await Products.find({ name: { $regex: search, $options: "i" } })
      .where("subcategories")
      .in(subCategories)
      .sort(sort)
      .skip(page * limit)
      .limit(limit);
    const productIds = products.map(p => p._id);
    const activeOffers = await Offer.findActiveOffers().where('product').in(productIds);
console.log(`active offers ${activeOffers}`.red)
    products = await Promise.all(products.map(async (product) => {
    const productOffer = activeOffers.find(o => o.product.equals(product._id));

      if (productOffer && productOffer.isValid()) {
        const discountedPrice = productOffer.calculateDiscountedPrice(product.price);

        return {
          ...product.toObject(),
          originalPrice: product.price,
          discountedPrice: Math.round(discountedPrice * 100) / 100,
          offer: {
            id: productOffer._id,
            name: productOffer.offerName,
            discountType: productOffer.discountType,
            discountValue: productOffer.discountValue
          }
        };
      }
      return product;
    }));
console.log(`${products}`.cyan)
    // Fetch the total count of products matching the filters
    const total = await Products.countDocuments({
      subcategories: { $in: subCategories },
      name: { $regex: search, $options: "i" },
    });
    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      subCat: subCatOptions,
      products,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error(`Error fetching products: ${error.message}`);
    next(new ErrorResponse("Failed to fetch products", 500));
  }
});




module.exports = {
  loadproducts,
  getProducts,
  getProductsTwo,
  getProduct,
  uploadImages,
  loadupload,
  loadCreateProduct,
  createProduct,
  onetwo,


}
