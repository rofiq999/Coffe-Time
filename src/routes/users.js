const express = require('express');
const cloudinaryUploader = require('../middleware/cloudinary');
const multer = require('multer');

const usersRouter = express.Router();
const allowedRole = require('../middleware/allowedRole');
const isLogin = require('../middleware/isLogin');
const validate = require('../middleware/validate');
const { memoryUpload } = require('../middleware/upload');
// const uploadimages = require('../middleware/upload.js');

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

const { get, create, edit, drop, editPassword } = require('../controler/users');

usersRouter.get('/', get);
usersRouter.post('/', validate.body('email', 'password', 'phone_number'), create);
usersRouter.patch('/editPassword', isLogin(), allowedRole('user', 'admin'), editPassword);
usersRouter.patch('/', isLogin(), allowedRole('user'), uploadFile, cloudinaryUploader, edit);
usersRouter.delete('/:id', isLogin(), allowedRole('admin'), drop);

module.exports = usersRouter;
