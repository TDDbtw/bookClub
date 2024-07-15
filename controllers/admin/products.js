const Products = require("../../models/products")
const Cart = require("../../models/cart")
const User = require("../../models/users")
const Categories = require("../../models/category")
const Subcategories = require("../../models/subcategory")
const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")
const jwt = require("jsonwebtoken")
// const colors = require("colors")
const fs = require("fs")
const path = require("path")
const sharp = require("sharp")

let userVar = ""



// Configure Multer for image uploads


const loadEditProduct = asyncHandler(async (req, res, next) => {
  const product = await Products.findById(req.params.id)
    .populate("category", "name") // Populate category name
    .populate("subcategories", "name") // Populate subcategory names
    .exec();
  const categories = await Categories.find();

  const subcategories = await Subcategories.find()
    .populate("category", "name")
    .exec();

  req.productId = req.params.id;

  res.render("./admin/productEditG", {
    product,
    categories,
    subcategories,
    name: "Edit Product",
  });


})

const addProduct = asyncHandler(async (req, res, next) => {

  upload.fields([{ name: "image", maxCount: 10 }])(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    const imagePaths = getImagePathsFromRequest(req);
    console.log(`image path is${imagePaths}`)
    const newProduct = await Products.create({
      name: "Product", 
      description: "this and that",
      price: 22,
      stockCount: 22,
      image: imagePaths, 
      // ... other fields you want to set by default ...
    });

    console.log("New product created:", newProduct); 
    res.redirect("/admin/products");

  })
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

  res.render("./admin/createProductG", {
    categories,
    subcategories,
    name: "Create Product",
  });



})
const createProduct = asyncHandler(async (req, res, next) => {

  const existingProduct = await Products.findOne({ name: { $regex: new RegExp(req.body.name, 'i') } });
  if (existingProduct) {
    return next(
      new ErrorResponse(`Product with the same name already exists` )
    );
  }


  // file
  let fileData = {}
  if (req.files) {
    // fileData = req.files[0]
    console.log("file Is".yellow.inverse)
    console.log(req.files[0])
    images = req.files.map((item, index) => {
      return item.path.replace("public", "..")
    })
    console.log(images)
  }
  const products = new Products({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    author:req.body.author,
    stockCount:req.body.stockCount,
    category:req.body.category,

  })
  console.log(req.body)
  products.image = images
  products.subcategories = req.body.subcategories
  products.save()
  res.status(201).redirect("/admin/products")














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
  // res.status(200).json({
    //   success: true,
    //   count: products.length,
    //   data: products,
    // })
  res.redirect("/admin/products")
})

///////////////
  // const createProducts = asyncHandler(async (req, res, next) => {
    //   console.log(req.body)
    //   const products = await Products.create(req.body)
    //   res.status(201).json({
      //     success: true,
      //     data: products,
      //   })
    // })

//  @desc     Update product
//  @routes PUT  /products/:id/edit
//  @access private
//////////////////////////////////////////////////////////////////////////////
  //

  const updateProducts = asyncHandler(async (req, res, next) => {

    const productId = req.params.id;
    const existingProduct = await Products.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }


    let fileData = {}
    if (req.files) {
      // fileData = req.files[0]
      console.log("file Is".yellow.inverse)
      console.log(req.files[0])
      images = req.files.map((item, index) => {
        return item.path.replace("public", "..")
      })
      console.log(images)
    }

console.log(`existing product ${existingProduct.image}`)
    const updatedProductData = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      author:req.body.author,
      stockCount:req.body.stockCount,
      category:req.body.category,
      subcategories:req.body.subcategory

    }; // Create a copy of req.body
    if(req.files){ 
      if(images.length==0){
        updatedProductData.image= existingProduct.image
      }
      else{
console.log(`${Array.isArray(images)}`.bgBlue)
console.log(`existing product image -- > ${Array.isArray(existingProduct.image)}`.bgCyan)
        updatedProductData.image=(existingProduct.image).concat(images)
      }
    }

    console.log(updatedProductData)
    // Handle status toggle
    if (req.body.status) {
      updatedProductData.status =
        req.body.status === "change" ? !existingProduct.status : existingProduct.status;
    }

    console.log(`${req.body.image}`)
    // Handle image updates (if needed)

    // Update the product
    await Products.updateOne({ _id: productId }, { $set: updatedProductData });

    res.json({ success: true });

  })


const updateImage = asyncHandler(async (req, res, next) => {
  const imageName = req.params.imageIndex;
  // const imagePath = path.join(__dirname, 'public/uploads', imageName);
  const item=await Products.findById(req.productId)
  // fs.unlink(imagePath, (err) => {
    //   if (err) {
      //     console.error('Error deleting image:', err);
      //     return res.status(500).json({ error: 'Error deleting image' });
      //   }
    //   res.status(200).json({ message: 'Image deleted successfully' });
    // });

  console.log(`${item}`)

})
//////////////////////////////////////////////////////////////////////////////

  //  @desc     Delete one product

//  @routes delete /products/:id/delete
  //  @access private

const deleteProducts = asyncHandler(async (req, res, next) => {
  try {
    console.log(req.params.id)
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
    console.log(`images uploaded successfully`.green.inverse)
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
let imageName = req.body.name;
const  item=req.body.name
const parts = imageName.split('/');
imageName = parts[parts.length - 1];
  if (removeImage(req.params.id,imageName,item)) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }

})

const imagesDirectory = path.join(__dirname, '../../public/imgs/productImgs/');

const removeImage = async (productId, imageName,item) => {
  const imagePath = path.join(imagesDirectory, imageName);
  console.log(`Attempting to remove image: ${imagePath}`.bgYellow);

  if (fs.existsSync(imagePath)) {
    console.log('File exists.'.bgRed);
    try {
      fs.unlinkSync(imagePath);
      console.log('File successfully deleted.'.bgGreen);

      // Update the MongoDB document
      const product = await Products.findById(productId);
      if (product) {
       const ind = product.image.indexOf(item) 
        product.image.splice(ind,1)
        await product.save();
        console.log('Image path successfully removed from database.'.bgCyan);
        return true;
      } else {
        console.error('Product not found.'.yellow);
        return false;
      }
    } catch (error) {
      console.error(`Error removing image: ${error.message}`);
      return false;
    }
  } else {
    console.log('File does not exist.'.bgRed);
    return false;
  }
};


module.exports = removeImage;
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
  addProduct,
  getSearchProducts,
  removeImg,
  test,

}
