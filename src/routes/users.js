const express = require('express');

const usersRouter = express.Router();

const { get, create, edit, drop } = require('../controler/controler.users');

usersRouter.get('/', get);
usersRouter.post('/', create);
usersRouter.patch('/:id_user', edit);
usersRouter.delete('/:id_user', drop);

module.exports = usersRouter;
