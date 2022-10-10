const express = require('express');

const voucherRouter = express.Router();

const { get, create, edit, drop, search } = require('../controler/controler.voucher');

voucherRouter.get('/', get);
voucherRouter.get('/search', search);
voucherRouter.post('/', create);
voucherRouter.patch('/:id_voucher', edit);
voucherRouter.delete('/:id_voucher', drop);

module.exports = voucherRouter;
