const Products = require("../../models/products");
const ErrorResponse = require(`../../utils/errorResponse`);
const asyncHandler = require("../../middleware/async");
const colors = require("colors");
const User = require("../../models/users");
const Cart = require("../../models/cart");
const Order = require("../../models/order");
const Category = require("../../models/category");
const Subcategories = require("../../models/subcategory");

// Get category for editing
const getCategoryEdit = asyncHandler(async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    const subcategories = await Subcategories.find({
      category: req.params.id,
    }).populate("category", "name"); // Populate only category name

    if (!category) {
      return next(
        new ErrorResponse(`Category not found with id ${req.params.id}`, 404)
      );
    }

    req.productId = req.params.id;

    res.render(`./admin/categoryEdit`, {
      category,
      subcategories,
      name: `Edit Category`,
    });
  } catch (error) {
    return next(new ErrorResponse("Error fetching category data", 500));
  }
});

// Get list of categories
const getCategoryList = asyncHandler(async (req, res, next) => {
  try {
    const categories = await Category.find();
  const totalCount = await Category.countDocuments();
    const subcategories = await Subcategories.find()
    const subCount = await Subcategories.countDocuments()
      .populate("category", "name")
      .exec();

    res.render(`./admin/categoryListG`, {
      categories,
      subcategories,
      totalCount,
      subCount, 
      name: `Categories`,
    });
  } catch (error) {
    return next(new ErrorResponse("Error fetching category data", 500));
  }
});

// Load create category page
const getCreateCategory = asyncHandler(async (req, res, next) => {
  try {
    const categories = await Category.find();
    const subcategories = await Subcategories.find()
      .populate("category", "name")
      .exec();

    res.render(`./admin/createCategoryG`, {
      categories,
      subcategories,
      name: `Create Category`,
    });
  } catch (error) {
    return next(new ErrorResponse("Error loading category creation page", 500));
  }
});

// Create a new subcategory
const createSubCategory = asyncHandler(async (req, res, next) => {
  try {
    const newSubCategory = new Subcategories(req.body);
    await newSubCategory.save();
    res.json({ success: true });
  } catch (error) {
    return next(new ErrorResponse("Error creating subcategory", 500));
  }
});

// Create a new category


const createCategory = asyncHandler(async (req, res, next) => {
  const { name, description, subcategories } = req.body;

  // Parse subcategories if they are in string format
  let subCat;
  try {
    subCat = JSON.parse(subcategories);
  } catch (error) {
    return next(new ErrorResponse("Invalid subcategories format", 400));
  }

  // Check if category with the same name already exists
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return next(new ErrorResponse("Category with this name already exists", 400));
  }

  // Check if subcategories exist and are valid
  const existingSubCategoryNames = await Subcategories.distinct("name");

  if (!existingSubCategoryNames) {
    return next(new ErrorResponse("Subcategory with this name already exists", 400));
  }
  const existingSubCategorySet = new Set(existingSubCategoryNames);

  // Handle file upload (if any)
  let imagePath = "";
  if (req.file) {
    // Adjust imagePath based on your file upload configuration
    imagePath = req.file.path.replace("public", "..");
  }

  // Create new category object
  const newCategory = new Category({
    name,
    description,
    image: imagePath,
  });

  // Save new category to database
  const savedCategory = await newCategory.save();

  // If subcategories are provided and it's an array, create them and associate with the new category
  if (Array.isArray(subCat) && subCat.length > 0) {
    const subcategoriesToCreate = subCat.map((subcategoryName) => ({
      name: subcategoryName,
      category: savedCategory._id, // Associate with the new category
    }));

    try {
      // Use `insertMany` for efficiency in batch insert
      const insertedSubcategories = await Subcategories.insertMany(subcategoriesToCreate);
      console.log(`Subcategories added successfully: ${insertedSubcategories.length}`);
    } catch (error) {
      return next(new ErrorResponse("Failed to create subcategories", 500));
    }
  }

  // Return success response with created category details
  res.status(201).json({ success: true, category: savedCategory });
});



// Get all categories
const getAllCategories = asyncHandler(async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    return next(new ErrorResponse("Error fetching categories", 500));
  }
});

// Get category by ID
const getCategoryById = asyncHandler(async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(
        new ErrorResponse(`Category not found with id ${req.params.id}`, 404)
      );
    }
    res.status(200).json(category);
  } catch (error) {
    return next(new ErrorResponse("Error fetching category", 500));
  }
});

// Update category by ID
const updateCategoryById = asyncHandler(async (req, res, next) => {
  try {

    const updates = { ...req.body };

    if (req.file) {
      // Ensure consistent handling of file paths
      const imagePath = req.file.path.replace(/^public/, "..");
      updates.image = imagePath;
    }

    if (req.body.subcategories) {
      let subCat = JSON.parse(req.body.subcategories);
      console.log("Subcategories received:", req.body.subcategories);
      console.log("Is subcategories an array?", Array.isArray(subCat));
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return next(
        new ErrorResponse(`Category not found with id ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: updatedCategory
    });



  } catch (error) {
    return next(new ErrorResponse("Error updating category", 500));
  }
});

// Delete SubCategory by ID
const deleteSubCategory = asyncHandler(async (req, res, next) => {
  try {
    const deletedSubCategory = await Subcategories.findByIdAndDelete(
      req.query.subCatId
    );

    if (!deletedSubCategory) {
      return next(
        new ErrorResponse(
          `Subcategory not found with id ${req.query.subCatId}`,
          404
        )
      );
    }

    res.status(200).json({ success: true });
  } catch (error) {
    return next(new ErrorResponse("Error deleting subcategory", 500));
  }
});

// Delete category by ID
const deleteCategoryById = asyncHandler(async (req, res, next) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return next(
        new ErrorResponse(`Category not found with id ${req.params.id}`, 404)
      );
    }

    // Delete associated subcategories
    await Subcategories.deleteMany({ category: req.params.id });
    res.status(200).json({ success: true });
  } catch (error) {
    return next(new ErrorResponse("Error deleting category", 500));
  }
});

module.exports = {
  createSubCategory,
  deleteSubCategory,
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getCategoryEdit,
  getCategoryList,
  getCreateCategory,
};
