const express = require('express');

const productRouter = express.Router();
const isLogin = require('../middleware/isLogin');
const uploadimages = require('../middleware/upload.js');
const allowedRole = require('../middleware/allowedRole');

const { create, edit, drop, search } = require('../controler/product.js');

productRouter.get('/', search);
productRouter.post('/', isLogin(), allowedRole('admin'), uploadimages.single('image'), create);
productRouter.patch('/:id', isLogin(), allowedRole('admin'), edit);
productRouter.delete('/:id', isLogin(), allowedRole('admin'), drop);
module.exports = productRouter;
