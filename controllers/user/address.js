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

const putEditAddress = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updatedAddress = req.body;

  try {
    const result = await User.updateOne(
      { "addresses._id": id },
      { 
        $set: { 
          "addresses.$.street": updatedAddress.street,
          "addresses.$.city": updatedAddress.city,
          "addresses.$.state": updatedAddress.state,
          "addresses.$.zip_code": updatedAddress.zip_code,
          "addresses.$.country": updatedAddress.country,
        }
      }
    );

    if (result.nModified === 0) {
      console.log(`Address not found or not updated`.red.inverse);
      return res.status(404).json({ message: "Address not found" });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});
// ****  DELETE ADDRESS  ****

  const deleteAddress = asyncHandler(async (req, res, next) => {
    console.log(`user is ${req.body.user}`)
    // Use updateOne to remove the address from the addresses array
    const result = await User.updateOne(
      { _id: req.body.user },
      { $pull: { addresses: { _id: req.params.id } } }
    )

    if (result.nModified === 0) {
      // If nModified is 0, it means the address was not found
      return res.status(404).json({ message: "Address not found" })
    }

    // Fetch the updated user after the update
    const user = await User.findById(req.body.user)

    res.status(200).json({ success: true })
    // res.redirect("/user/profile")
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
  putEditAddress,
  deleteAddress,
  test,
}
