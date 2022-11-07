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
const { memoryUpload, errorHandler } = require('../middleware/upload');
// diskUpload,
const cloudinaryUploader = require('../middleware/cloudinary');
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

mainRouter.post(
  '/cloud',
  (req, res, next) =>
    memoryUpload.single('image')(req, res, (err) => {
      errorHandler(err, res, next);
    }),
  cloudinaryUploader,
  (req, res) => {
    console.log(req.file);
    res.status(200).json({
      msg: 'Upload Succes',
      data: {
        url: req.file.url,
        secure: req.file.secure_url,
        data: req.file.filename,
      },
    });
  }
);
mainRouter.get(`/`, (req, res) => {
  res.json({
    msg: `Deploy Conected Succes`,
  });
});

//export
module.exports = mainRouter;
