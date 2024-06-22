const Products = require("../../models/products")
const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")
const colors = require("colors")
const User = require("../../models/users")
const Cart = require("../../models/cart")

const getCart = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  console.log(`req.user = ${req.user.id}`)
  console.log(user.id)
  req.user=user
  const cart = await Cart.findOne({ user: user.id })
  req.session.cartId = cart.id
  req.session.user = user
  // console.log(`cart is ${cart}`)
  // console.log(`cart is ${cart}`)

  res.render("./users/cart", { user, cart })
})

const getCartList = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  const cart = await Cart.findOne({ user: user.id })

  res.json(cart); 
})
const getCheckout = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  req.user=user
  const cart = await Cart.findOne({ user: user.id })
  const paypalId = process.env.PAYPAL_CLIENT_ID
  const products = cart.items
  let shippingTotal = ""
  if (user.shipping_address && user.shipping_address.country) {
    switch (user.shipping_address.country) {
      case "United States":
        shippingTotal = 0
        break
      case "Canada":
        shippingTotal = 25
        break
      case "Mexico":
        shippingTotal = 40
        break
      default:
        break
    }
  } else shippingTotal = "please Select the billing and Shipping address"
  console.log(`shipping total is${shippingTotal}`)
  const CLIENT_ID=process.env.PAYPAL_CLIENT_ID
  shippingTotal=Number(shippingTotal)
  res.render(`./users/checkoutG`, {
    CLIENT_ID,
    user,
    products,
    cart,
    shippingTotal,
    paypalId,
  })

})

// Controller for handling cart operations

// Add item to cart
const addItemToCart = asyncHandler(async (req, res, next) => {
  let { user, productId, image, name, productPrice, quantity } = req.body
  quantity = Number(quantity)
  console.log(`image =  ${image}`)
  // image = image[0]
  console.log(`from post --> ${user}`)
  console.log(
    `image ${image},\n product ${productId},\nquantity ${quantity},\n name ${name},\n productPrice ${productPrice}`
  )
  // Check if the cart already exists for the user
  let cart = await Cart.findOne({ user })

  // If cart doesn't exist, create a new one
  if (!cart) {
    cart = new Cart({ user, items: [] })
  }

  // Check if the item is already in the cart
  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  )

  if (existingItem) {
    // If item already exists, update the quantity
    existingItem.quantity += quantity
  } else {
    // If item is not in the cart, add it
    cart.items.push({ productId, image, name, productPrice, quantity })
  }

  // Update the billTotal
  cart.billTotal = calculateBillTotal(cart.items)

  // Save the updated cart
  await cart.save()

  res.redirect("/cart")
  // res.status(201).json(cart)
  // if (error) {
    //   console.error(error)
    //   res.status(500).json({ error: "Internal Server Error" })
    // }
})




const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user._id; // Assuming you have user authentication and `req.user` contains the authenticated user
  console.log(`${req.user._id}`) 

  if (quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be greater than zero' });
  }

  // Find the user's cart
  let cart = await Cart.findOne({ user:userId });
  console.log(`${cart}`)
  // const cart = await Cart.findById(req.session.cartId)
  console.log(`${cart}`)
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  // Find the product in the cart
  const cartItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  if (cartItemIndex === -1) {
    return res.status(404).json({ message: 'Product not found in cart' });
  }

  // Update the quantity
  cart.items[cartItemIndex].quantity = quantity;

  // Save the updated cart
  cart = await cart.save();

  // Recalculate the total
  const billTotal = cart.items.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
  cart.billTotal = billTotal;
  await cart.save();

  res.status(200).json(cart);

})





// Remove item from cart
const removeItemFromCart = asyncHandler(async (req, res, next) => {
  const productId = req.params.id
  console.log(`productId = ${productId}`)
  const cart = await Cart.findById(req.session.cartId)
  console.log(`delete from ${cart}`)
  cart.items = cart.items.filter((item) => item.productId == productId)
  console.log(`${cart.items}`) 
  await cart.save()

  // Redirect the user to the cart page
  // res.redirect("/cart")
  res.json({ success: true })
  // if (error) {
    //   console.error(error)
    //   res.status(500).json({ error: "Internal Server Error" })
    // }
})

// Get cart details
const getCartDetails = asyncHandler(async (req, res, next) => {
  const { user } = req.params
  console.log(`from cart post ${user}`)

  const cart = await Cart.findOne({ user })

  if (!cart) {
    return res.status(404).json({ error: "Cart not found" })
  }

  res.status(200).json(cart)
  if (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// Mark item as selected or unselected in cart
const updateItemSelectedStatus = async (req, res) => {
  try {
    const { user, productId, selected } = req.body

    const cart = await Cart.findOne({ user })

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" })
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    )

    if (!item) {
      return res.status(404).json({ error: "Item not found in the cart" })
    }

    item.selected = selected

    // Save the updated cart
    await cart.save()

    res.status(200).json(cart)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

// Helper function to calculate the bill total based on items in the cart
const calculateBillTotal = (items) => {
  return items.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0
  )
}

module.exports = {
  getCart,
  getCheckout,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  getCartDetails,
  updateItemSelectedStatus,
  getCartList
}
