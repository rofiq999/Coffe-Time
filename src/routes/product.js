const express = require('express');

const productRouter = express.Router();

const { get, create, edit, drop, search, sorth, filter } = require('../controler/controler.product.js');

productRouter.get('/', get);
productRouter.get('/search', search);
productRouter.get('/ascen', sorth);
productRouter.get('/filter', filter);
productRouter.post('/', create);
productRouter.patch('/:id_product', edit);
productRouter.delete('/:id_product', drop);
module.exports = productRouter;
