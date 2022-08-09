const fileService = require('../services/fileService');

const uploadImage = (destination) => (req, res, next) => {
  const upload = fileService.upload(destination);

  upload(req, res, (err) => {
    if (err) {
      if (err.message === 'FILE_TYPE_NOT_ALLOWED') {
        return res.status(422).send(err.message);
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).send(err.code);
      }
      next(err)
    }
    next();
  });
}


module.exports = { uploadImage };