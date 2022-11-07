const express = require('express');
const multer = require('multer');
const cloudinaryUploader = require('../middleware/cloudinary');

const productRouter = express.Router();
const isLogin = require('../middleware/isLogin');
// const uploadimages = require('../middleware/upload.js');
const allowedRole = require('../middleware/allowedRole');
const { memoryUpload } = require('../middleware/upload');
// diskUpload,
function uploadFile(req, res, next) {
  memoryUpload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      // res.json('Size image minimum 4mb');
      return res.status(400).json({ msg: err.message });
    } else if (err) {
      // Error File format
      return res.json({ msg: err.message });
    }
    next();
  });
}

const { create, edit, drop, search, getId } = require('../controler/product.js');

productRouter.get('/', search);
productRouter.get('/:id', getId);
productRouter.post('/', isLogin(), allowedRole('admin'), uploadFile, cloudinaryUploader, create);
productRouter.patch('/:id', isLogin(), allowedRole('admin'), uploadFile, cloudinaryUploader, edit);
productRouter.delete('/:id', isLogin(), allowedRole('admin'), drop);
module.exports = productRouter;
