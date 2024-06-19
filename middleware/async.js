// DRY $$ TO AVOID USE TRY CATCH BLOCK REPEATEDLY

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

module.exports = asyncHandler
