const express = require('express');

const transactionstRouter = express.Router();
const isLogin = require('../middleware/isLogin');
const allowedRole = require('../middleware/allowedRole');

const { get, history, create, edit, drop } = require('../controler/transactions');

transactionstRouter.get('/', get);
transactionstRouter.get('/history', isLogin(), allowedRole('user'), history);
transactionstRouter.post('/', isLogin(), allowedRole('admin', 'user'), create);
transactionstRouter.patch('/:id', isLogin(), allowedRole('admin'), edit);
transactionstRouter.delete('/:id', isLogin(), allowedRole('admin'), drop);

module.exports = transactionstRouter;
