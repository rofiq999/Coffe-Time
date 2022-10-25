const express = require('express');
const multer = require('multer');
const productRouter = express.Router();
const isLogin = require('../middleware/isLogin');
const uploadimages = require('../middleware/upload.js');
const allowedRole = require('../middleware/allowedRole');
function uploadFile(req, res, next) {
  const upload = uploadimages.single('image');

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log(err);
      res.json('Size image maximal 4mb');
    } else if (err) {
      // Error File format
      res.json('Format image Wrong!');
    }
    // Everything went fine.
    next();
  });
}

const { create, edit, drop, search } = require('../controler/product.js');

productRouter.get('/', search);
productRouter.post('/', isLogin(), allowedRole('admin'), uploadFile, create);
productRouter.patch('/:id', isLogin(), allowedRole('admin'), uploadFile, edit);
productRouter.delete('/:id', isLogin(), allowedRole('admin'), drop);
module.exports = productRouter;
