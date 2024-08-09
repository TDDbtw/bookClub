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

  if (!req.cookies.jwt) {res.redirect('auth/login')}
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
const getSearchProducts = asyncHandler(async (req, res, next) => {
  let query = {}
  // if (req.query.search) {
  // }
  user = req.cookies ? userVar : ""
  const products = await Products.find({
    name: { $regex: req.query.search, $options: "i" },
  })
  const responseData = {
    products: products,
    user: user,
  }
  res.json(responseData)
})
const getSortProducts = asyncHandler(async (req, res, next) => {
console.log(`${ res.search}`.red)
  let query = {}
  if (req.query.sortBy) {
    let sortOption = {}
    switch (req.query.sortBy) {
      case "popularity":
        sortOption = { ratings: -1 }
        break
      case "lowToHigh":
        sortOption = { price: 1 }
        break
      case "highToLow":
        sortOption = { price: -1 }
        break
      case "averageRatings":
        sortOption = { ratings: 1 }
        break
      case "featured":
        sortOption = { featured: -1 }
        break
      case "newArrivals":
        sortOption = { createdAt: -1 }
        break
      case "aToZ":
        sortOption = { name: 1 }
        break
      case "zToA":
        sortOption = { name: -1 }
        break
      default:
        break
    }
    query = Products.find().sort(sortOption)
  } else {
    query = Products.find()
  }

  user = req.cookies ? userVar : ""
  // if (req.query.subcategory) {
  //   // Filter products by subcategory
  //   query = query.find({ : req.query.subcategory })
  // }
  const products = await query.exec()
  // console.log()
  const responseData = {
    products: products,
    user: user,
  }
  res.json(responseData)
  // catch (error) {
  // res.status(500).json({ error: "Internal Server Error" })
  // }
})
const getFilterProducts = asyncHandler(async (req, res, next) => {
  let query = {}
  if (req.query.subcategory) {
    console.log(req.query.subcategory)
  }
  const products = await Products.find()
  let filteredItems = products.filter((item) => {
    return item.subcategories.includes(req.query.subcategory)
  })
  // console.log(filteredItems)
  // res.json(req.query.products)
  user = req.cookies ? userVar : ""
  // // const products = await query.exec()
  // // // console.log()
  const responseData = {
    products: filteredItems,
    user: user,
  }
  res.json(responseData)
  // catch (error) {
  // res.status(500).json({ error: "Internal Server Error" })
  // }
})

const getSearchSortFilter = asyncHandler(async (req, res, next) => {
let query = {};
  let sortOption = {};

  // Search functionality
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
  }

  // Sort functionality
  if (req.query.sortBy) {
    switch (req.query.sortBy) {
      case "popularity":
        sortOption = { ratings: -1 };
        break;
      case "lowToHigh":
        sortOption = { price: 1 };
        break;
      case "highToLow":
        sortOption = { price: -1 };
        break;
      case "averageRatings":
        sortOption = { ratings: 1 };
        break;
      case "featured":
        sortOption = { featured: -1 };
        break;
      case "newArrivals":
        sortOption = { createdAt: -1 };
        break;
      case "aToZ":
        sortOption = { name: 1 };
        break;
      case "zToA":
        sortOption = { name: -1 };
        break;
      default:
        break;
    }
  }

  // Filter functionality
  if (req.query.subcategory) {
    query.subcategories = { $in: [req.query.subcategory] };
  }

  // Execute the query with sorting
  const products = await Products.find(query).sort(sortOption);

  const user = req.cookies ? userVar : "";
  const responseData = {
    products: products,
    user: user,
  };

  res.json(responseData);
});

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
  try {
    const product = await Products.findById(req.params.id)
      .populate('category', 'name') // Populate category name
      .populate('subcategories', 'name') // Populate subcategory names
      .populate('offer')
      .exec()

    if (!product) {
      return next(
        new ErrorResponse(`Product not found with the id of ${req.params.id}`, 404)
      );
    }

    let discountedPrice = product.price;
    if (product.offer) {
      const offer = await Offer.findById(product.offer._id);
      if (offer  && offer.isApplicable(product.price)) {
        discountedPrice = offer.applyDiscount(product.price);
      }
    }
    let user = null;
    if (req.cookies.jwt) {
      const decoded = jwt.verify(req.cookies.jwt, process.env.SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      user = req.user;
    }

    const wishlist = await Wishlist.findOne({ user: user ? user._id : null });
    const ifItem = wishlist ? wishlist.items.some(item => item.product.equals(req.params.id)) : false;
    res.render('./users/PDP.pug', { product, user, ifItem, discountedPrice });
  } catch (error) {
    console.error('Error fetching product:', error);
    next(new ErrorResponse('An error occurred while fetching the product', 500));
  }
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
    const products = await Products.find({ name: { $regex: search, $options: "i" }, status:true })
      .where("subcategories")
      .in(subCategories)
      .sort(sort)
      .skip(page * limit)
      .limit(limit);
    const productIds = products.map(p => p._id);
    const activeOffers = await Offer.findActiveOffers().where('product').in(productIds);
   




    // Fetch the total count of products matching the filters
    const total = await Products.countDocuments({
      subcategories: { $in: subCategories },
      name: { $regex: search, $options: "i" },
    });

    // Prepare the response
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
  getFilterProducts,
  getSearchProducts,
  loadproducts,
  getProducts,
  getProductsTwo,
  getProduct,
  getSortProducts,
  uploadImages,
  loadupload,
  loadCreateProduct,
  createProduct,
  onetwo,

  
}
