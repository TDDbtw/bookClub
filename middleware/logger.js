//  @desc     log request to console
//  @routes get/users/:id
//  @access private

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.protocol}://${req.get(`host`)}`)
  next()
}

module.exports = logger
