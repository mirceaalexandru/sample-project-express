function validate(schema) {
  return (req, res, next) => {

    const result = schema.validate(req);

    if (result.error) {
      if (req.app.get('config').env === 'development') {
        // provide full error in the response
        return res.status(400).json({err: result.error.message})
      } else {
        return res.sendStatus(400)
      }
    }
    next()
  }
}


module.exports = {
  validate
}