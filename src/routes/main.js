const express = require('express');

const mainRouter = express.Router();

//menghubungkan router ke product
const productRouter = require('./product.js');
const usersRouter = require('./users.js');
const transactionsRouter = require('./transactions.js');
const voucherRouter = require('./voucher.js');
const authRouter = require('./auth');
const prefix = '/coffe_time';

//import middleware
// const imageUpload = require('../middleware/upload');

//menayambungkan main router ke sub router
mainRouter.use(`${prefix}/product`, productRouter);
mainRouter.use(`${prefix}/users`, usersRouter);
mainRouter.use(`${prefix}/auth`, authRouter);
mainRouter.use(`${prefix}/transactions`, transactionsRouter);
mainRouter.use(`${prefix}/voucher`, voucherRouter);
//cek koneksi
//http://localhost:7070/
mainRouter.get('/', (req, res) => {
  res.json({
    msg: 'sudah berjalan dan berhasil',
  });
});

//export
module.exports = mainRouter;
