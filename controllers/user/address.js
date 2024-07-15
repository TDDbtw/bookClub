const express = require("express")
const User = require("../../models/users")
const Products = require("../../models/products")
const ErrorResponse = require(`../../utils/errorResponse`)
const asyncHandler = require("../../middleware/async")
const countriesData = require("../../utils/countriesData")
// Import the User model

const router = express.Router()

// ****  GET ALL ADDRESSES  ****

  const getAddAddress = asyncHandler(async (req, res, next) => {
    const userId = req.user.id
    const user = await User.findById(userId)
    res.render("./users/addAddress", { user, countries: countries })
  })
const getEditAddress = asyncHandler(async (req, res, next) => {
  const userId = req.user.id
  const user = await User.findById(userId)
  const address = user.addresses.id(req.params.id)
  res.render("./users/editAddress", { user, address })
})

router.get("/addresses", async (req, res) => {
  try {
    const addresses = await User.find().select("addresses") // Select only the "addresses" field
    res.json(addresses)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ****  CREATE NEW ADDRESS  ****

  const postAddAddress = asyncHandler(async (req, res, next) => {
    const newAddress = req.body // Get the new address data from the request body
    console.log(newAddress)
    const user = await User.findById(req.user.id) // Find the user by their ID
    console.log(user)
    user.addresses.push(newAddress) // Add the new address to the user's addresses array
    await user.save()
    console.log(`checkout --> ${req.body.checkout}`)
    res.json({ success: true })
    // req.body.checkout == true
    // ? res.redirect("/cart/checkout") // Send the updated user object back to the client
    // : res.redirect("/user/profile")
  })

// ****  UPDATE ADDRESS  ****
const patchEditAddress = asyncHandler(async (req, res, next) => {
  try {
    const addressId = req.params.id; // Assuming you pass the address ID in the URL
    const updateData = req.body;
    const user = await User.findOne({'addresses._id':addressId})
    // Validate input data
    if (!updateData.address || !updateData.city || !updateData.state || !updateData.zip_code) {
      return res.status(400).json({ error: 'Missing required fields' });
    }


    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the address in the user's addresses array
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);

    if (addressIndex === -1) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Update the address
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      address: updateData.address,
      city: updateData.city,
      state: updateData.state,
      zip_code: updateData.zip_code,
      country: updateData.country || 'United States'
    };

    // Check if this address should be set as billing or shipping address
    if (updateData.default_billing === '1') {
      user.billing_address = user.addresses[addressIndex];
    }
    if (updateData.default_shipping === '1') {
      user.shipping_address = user.addresses[addressIndex];
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Address updated successfully', addressIndex });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }






});
// ****  DELETE ADDRESS  ****

  const deleteAddress = asyncHandler(async (req, res, next) => {
    console.log(`user is ${req.body.user}`)
    const result = await User.updateOne(
      { _id: req.body.user },
      { $pull: { addresses: { _id: req.params.id } } }
    )
console.log(`${req.params.id}`.yellow)
console.log(`${req.body.user}`.cyan)
    if (result.nModified === 0) {
      return res.status(404).json({ message: "Address not found" })
    }

    const user = await User.findById(req.body.user)
    res.status(200).json({ success: true })
  })

const test = asyncHandler(async (req, res, next) => {
  // const countryName = req.query.country
  // const country = countriesData.countries.find(
    //   (country) => country.name === countryName
    // )
  let addressId = ""
  if (req.query.billing_address) {
    console.log(`billing address is${req.query.billing_address}`)
    addressId = req.query.billing_address
  }

  if (req.query.shipping_address) {
    console.log(`shipping address is${req.query.shipping_address}`)
    addressId = req.query.shipping_address
  }

  console.log(`test running`)
  const user = await User.findOne({ "addresses._id": addressId })
  const address = user.addresses.find((address) => address.id === addressId)
  if (req.query.shipping_address) user.shipping_address = address
  if (req.query.billing_address) user.billing_address = address
  user.save()
  console.log(user)

  res.status(200)

  // if (country) {
    //   state = country.states
    //   res.send(state)
    // }
  // console.log(`billing address: ${billing_address}`)
  // // user.billing_address._id = billing_address
  // user.billing_address = address
  // // user.shipping_address = address
  // // res.json(user)
  // // console.log(`user is ${user}`)
  // console.log(address)
})

module.exports = {
  getAddAddress,
  getEditAddress,
  postAddAddress,
  patchEditAddress,
  deleteAddress,
  test,
}
