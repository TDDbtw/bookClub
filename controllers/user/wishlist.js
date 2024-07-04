const Products = require("../../models/products")
const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")
const colors = require("colors")
const User = require("../../models/users")
const Cart = require("../../models/cart")
const Wishlist = require("../../models/wishlist")

const getWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  res.render("./users/wishList", { user })
})


const addToWishlist = asyncHandler(async (req, res, next) => {
const  userId = req.body.userId
console.log(`${userId}`.red) 
const productId =req.params.productId
console.log(`${productId}`.yellow)
  try {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }
    // Check if product is already in wishlist
    const itemExists = wishlist.items.some(item => item.product.toString() === productId);
    if (!itemExists) {
      wishlist.items.push({ product: productId });
      await wishlist.save();
    return res.status(200).send('Item added to wishlist');
    } else {
      return res.status(400).send('Item already in wishlist');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }


})


const removeFromWishlist = asyncHandler(async (req, res, next) => {
  const userId=req.user._id
 const  productId = req.params.productId;
  try {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (wishlist) {
      wishlist.items = wishlist.items.filter(item => item.product.toString() !== productId);
      await wishlist.save();
      return res.status(200).send('Item removed from wishlist');
    }
    res.status(404).send('Wishlist not found');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }

})



const getUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  try {
    const wishlist = await Wishlist.findOne({ user: user._id }).populate('items.product');
   console.log(`wish list is ${wishlist}`) 
    res.status(200).json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }

})

const addWishlistItemToCart = asyncHandler(async (req, res, next) => {
const userId = req.body.user;
console.log(`${userId}`.red)
const productId=req.params.productId
  
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product is already in cart
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      // If product already exists, increase quantity
      cart.items[itemIndex].quantity += 1;
    } else {
      // If product does not exist, add new item with necessary details
      cart.items.push({
        productId: product._id,
        name: product.name,
        productPrice: product.price,
        image: product.image[0], // assuming the first image
        quantity: 1
      });
    }

    await cart.save();
    res.status(200).json(cart);

})


module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  addWishlistItemToCart,
}
