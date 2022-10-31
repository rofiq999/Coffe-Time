const express = require('express');

const usersRouter = express.Router();
const multer = require('../middleware/upload');
const allowedRole = require('../middleware/allowedRole');
const isLogin = require('../middleware/isLogin');
const validate = require('../middleware/validate');
const uploadimages = require('../middleware/upload.js');

function uploadFile(req, res, next) {
  const upload = uploadimages.single('image');

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.json('Size image minimum 4mb');
    } else if (err) {
      // Error File format
      res.json(err.message);
    }
    next();
  });
}

const { get, create, edit, drop, editPassword } = require('../controler/users');

usersRouter.get('/', get);
usersRouter.post('/', validate.body('email', 'password', 'phone_number'), create);
usersRouter.patch('/editPassword', isLogin(), allowedRole('user', 'admin'), uploadFile, editPassword);
usersRouter.patch('/', isLogin(), allowedRole('user'), uploadimages.single('image'), edit);
usersRouter.delete('/:id', isLogin(), allowedRole('admin'), drop);

module.exports = usersRouter;
