const express = require('express');

const usersRouter = express.Router();
const allowedRole = require('../middleware/allowedRole');
const isLogin = require('../middleware/isLogin');
const { get, create, edit, drop, editPassword } = require('../controler/users');

usersRouter.get('/', get);
usersRouter.post('/', create);
usersRouter.patch('/editPassword', isLogin(), editPassword);
usersRouter.patch('/:id', isLogin(), allowedRole('user'), edit);
usersRouter.delete('/:id', isLogin(), allowedRole('admin'), drop);

module.exports = usersRouter;
