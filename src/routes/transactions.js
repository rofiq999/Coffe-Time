const express = require('express');

const transactionstRouter = express.Router();

const { get, create, edit, drop } = require('../controler/controler.transactions');

transactionstRouter.get('/', get);
transactionstRouter.post('/', create);
transactionstRouter.patch('/:id_transactions', edit);
transactionstRouter.delete('/:id_transactions', drop);

module.exports = transactionstRouter;
