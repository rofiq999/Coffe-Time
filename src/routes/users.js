const express = require('express');

const usersRouter = express.Router();
const allowedRole = require('../middleware/allowedRole');
const isLogin = require('../middleware/isLogin');
const validate = require('../middleware/validate');
const uploadimages = require('../middleware/upload.js');
const { get, create, edit, drop, editPassword } = require('../controler/users');

usersRouter.get('/', get);
usersRouter.post('/', validate.body('email', 'password', 'phone_number'), create);
usersRouter.patch('/editPassword', isLogin(), allowedRole('user', 'admin'), editPassword);
usersRouter.patch('/', isLogin(), allowedRole('user'), uploadimages.single('image'), edit);
usersRouter.delete('/:id', isLogin(), allowedRole('admin'), drop);

module.exports = usersRouter;
