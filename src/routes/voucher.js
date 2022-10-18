const express = require('express');

const voucherRouter = express.Router();
const isLogin = require('../middleware/isLogin');
const allowedRole = require('../middleware/allowedRole');

const { get, create, edit, drop, search } = require('../controler/voucher');

voucherRouter.get('/', get);
voucherRouter.get('/search', search);
voucherRouter.post('/', isLogin(), allowedRole('admin'), create);
voucherRouter.patch('/:id', isLogin(), allowedRole('admin'), edit);
voucherRouter.delete('/:id', isLogin(), allowedRole('admin'), drop);

module.exports = voucherRouter;
