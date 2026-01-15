const Products = require("../../models/products")
const Cart = require("../../models/cart")
const Offers = require("../../models/offer")
const User = require("../../models/users")
const Categories = require("../../models/category")
const Subcategories = require("../../models/subcategory")
const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")
const jwt = require("jsonwebtoken")
const { cloudinary } = require("../../utils/multerUpload")

let userVar = ""



// Configure Multer for image uploads


const loadEditProduct = asyncHandler(async (req, res, next) => {
  const product = await Products.findById(req.params.id)
    .populate("category", "name") // Populate category name
    .populate("subcategories", "name") // Populate subcategory names
    .populate('offer')
    .exec();

  const iscat = await Products.findById(req.params.id)

  const offers = await Offers.find().sort({ name: 1 })
  const categories = await Categories.find();

  const subcategories = await Subcategories.find()
    .populate("category", "name")
    .exec();

  req.productId = req.params.id;
  res.render("./admin/productEditG", {
    product,
    categories,
    subcategories,
    items: offers,
    name: "Edit Product",
  });


})



const loadProductList = asyncHandler(async (req, res, next) => {
  const products = await Products.find()
    .populate("category", "name")
    .populate("subcategories", "name")
    .exec();

  const totalCount = await Products.countDocuments();
  const active = await Products.countDocuments({ status: true });

  res.render("./admin/productList", {
    totalCount,
    active,
    products,
    name: "Product List",
  });
})
const loadCreateProduct = asyncHandler(async (req, res, next) => {

  const categories = await Categories.find();
  const subcategories = await Subcategories.find()
    .populate("category", "name")
    .exec();
  const offers = await Offers.find().sort({ name: 1 })

  res.render("./admin/createProductG", {
    categories,
    subcategories,
    name: "Create Product",
    items: offers,
  });



})
const createProduct = asyncHandler(async (req, res, next) => {

  const existingProduct = await Products.findOne({ name: { $regex: new RegExp(req.body.name, 'i') } });
  if (existingProduct) {
    return next(
      new ErrorResponse(`Product with the same name already exists`)
    );
  }
  let offer = ''
  // Get Cloudinary URLs from uploaded files
  let images = []
  if (req.files && req.files.length > 0) {
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.path) // Cloudinary URLs
    }
    const products = new Products({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      author: req.body.author,
      stockCount: req.body.stockCount,
      category: req.body.category,

    })

    if (req.body.offer != '') {
      products.offer = req.body.offer

    }
    products.image = images
    products.subcategories = req.body.subcategories
    products.save()
    res.status(201).redirect("/admin/products")

  })

// @desc     Get all products
// @route    GET /products
// @access   private
const getProducts = asyncHandler(async (req, res, next) => {
  let queryStr = JSON.stringify(req.query)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)
  const query = Products.find(JSON.parse(queryStr))
  const products = await query

  res.redirect("/admin/products")
})

///////////////

const updateProducts = asyncHandler(async (req, res, next) => {

  const productId = req.params.id;
  const existingProduct = await Products.findById(productId);

  if (!existingProduct) {
    return res.status(404).json({ error: "Product not found" });
  }


  // Get Cloudinary URLs from uploaded files
  let images = []
  if (req.files && req.files.length > 0) {
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.path) // Cloudinary URLs
    }

    const updatedProductData = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      author: req.body.author,
      stockCount: req.body.stockCount,
      category: req.body.category,
      subcategories: req.body.subcategory

    }; // Create a copy of req.body

    if (req.body.offer !== 'none') {
      if (req.body.offer !== 'none') {
        updatedProductData.offer = req.body.offer;
      }
      else {
        updatedProductData.offer = null;
      }
      if (req.files) {
        if (images.length == 0) {
          updatedProductData.image = existingProduct.image
        }
        else {
          updatedProductData.image = (existingProduct.image).concat(images)
        }
      }


      // Handle status toggle
      if (req.body.status) {
        updatedProductData.status =
          req.body.status === "change" ? !existingProduct.status : existingProduct.status;
      }


      // Handle image updates (if needed)

      // Update the product
      await Products.updateOne({ _id: productId }, { $set: updatedProductData });

      res.json({ success: true });

    })


const updateImage = asyncHandler(async (req, res, next) => {
  const imageName = req.params.imageIndex;
  // const imagePath = path.join(__dirname, 'public/uploads', imageName);
  const item = await Products.findById(req.productId)
  // fs.unlink(imagePath, (err) => {
  //   if (err) {
  //     console.error('Error deleting image:', err);
  //     return res.status(500).json({ error: 'Error deleting image' });
  //   }
  //   res.status(200).json({ message: 'Image deleted successfully' });
  // });

})
//////////////////////////////////////////////////////////////////////////////

//  @desc     Delete one product

//  @routes delete /products/:id/delete
//  @access private

const deleteProducts = asyncHandler(async (req, res, next) => {
  try {
    const product = await Products.findByIdAndDelete(req.params.id)

    if (!product) {
      return next(
        new ErrorResponse(
          `Product not found with the id of ${req.params.id}`,
          404
        )
      )
    }
    res.json({ success: true })
  } catch (err) {
    return next(new ErrorResponse("Internal Server Error", 500))
  }
})
const getSearchProducts = asyncHandler(async (req, res, next) => {
  let query = {}
  // if (req.query.search) {
  // }
  const products = await Products.find({
    name: { $regex: req.query.search, $options: "i" },
  })
  const responseData = {
    products: products,
  }
  res.json(responseData)
})

const loadupload = asyncHandler(async (req, res, next) => {
  const products = await Products.find(images)
  res.render("uploadImage", { images })
})
const uploadImages = asyncHandler(async (req, res) => {
  await upload(req, res, function (err) {
    // At this point, the files are uploaded, and you can save the file paths or URLs in your MongoDB document
    const imagePaths = req.files.map(
      (file) => `http://localhost:3001/uploads/${file.filename}`
    )
    // Save the imagePaths in your MongoDB document

    res.json({ imagePaths: imagePaths })
  })
})

const test = asyncHandler(async (req, res, next) => {
  const products = req.body
  console.log(req.body)
  res.json({ products })
})

const removeImg = asyncHandler(async (req, res, next) => {
  const imageUrl = req.body.name;
  const success = await removeImage(req.params.id, imageUrl);

  if (success) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
})

const removeImage = async (productId, imageUrl) => {
  try {
    // Extract public_id from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex === -1) {
      console.error('Invalid Cloudinary URL format');
      return false;
    }

    // Get everything after 'upload/v[version]/'
    const publicIdWithExt = urlParts.slice(uploadIndex + 2).join('/');
    // Remove file extension
    const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok' || result.result === 'not found') {
      // Update the MongoDB document
      const product = await Products.findById(productId);
      if (product) {
        const ind = product.image.indexOf(imageUrl);
        if (ind !== -1) {
          product.image.splice(ind, 1);
          await product.save();
          return true;
        }
      } else {
        console.error('Product not found.');
        return false;
      }
    }

    return false;
  } catch (error) {
    console.error(`Error removing image: ${error.message}`.red);
    return false;
  }
};

module.exports = {
  getProducts,
  updateProducts,
  deleteProducts,
  uploadImages,
  updateImage,
  loadupload,
  loadEditProduct,
  loadProductList,
  loadCreateProduct,
  createProduct,
  // addProduct,
  getSearchProducts,
  removeImg,
  test,
}
