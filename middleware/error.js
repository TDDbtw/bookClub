const ErrorResponse = require("../utils/errorResponse")

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // log to console

  console
    .log

    // err
    // `${err}`.red
    ()

  // mongoose bad Object id

  if (err.name === `CastError`) {
    const message = `The ${
      err.model
      // .modelName
      // .toLowerCase()
    } with id of ${err.value} was not found.`
    error = new ErrorResponse(message, 404)
  }
  // Mongoos duplicate key

  if (err.code === 11000 || err.name === "E11000") {
    const message = `The entered Email-id already exists`
    error = new ErrorResponse(message, 400)
  }

  //Mongoose validation error

  if (err.name === `ValidationError`) {
    const message = Object.values(err.errors).map((val) => val.message)
    error = new ErrorResponse(message, 400)
  }

  if (err.code === 404) {
    res.render("/views/auth/errors/404.pug")
  }
  // if (err.message === "Invalid Email or Password") {
  //   errorMessage = error.message
  //   res.render("./auth/user/logInForm")
  // }
  // Assuming this is your error handler middleware
  const errorMessage = err.message || "An error occurred"
  res
    .status(err.statusCode || 500)
    // .redirect(`?error=${encodeURIComponent(errorMessage)}`)

    .json({
      successss: false,

      error: error.message || `server error`,
    })
}

module.exports = errorHandler
