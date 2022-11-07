// const { query } = require('express');
const productRepo = require('../repo/product');
const sendResponse = require('../helper/response');

// GET data

const create = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  try {
    if (req.file) {
      // response.rows[0].image = `/images/${req.file.filename}`;
      var image = `/${req.file.public_id}.${req.file.format}`;
    }
    // const response = await productRepo.createProduct(req.body, (req.file.filename = `/image/${req.file.filename}`));
    const response = await productRepo.createProduct(req.body, req.file.url);
    sendResponse.success(res, 201, {
      result: {
        msg: 'Product created successfully.',
        data: response.rows,
        filename: image,
        url: req.file.url,
      },
    });
  } catch (err) {
    console.log(err);
    sendResponse.error(res, 500, 'Internal Server Error');
  }
};

const edit = async (req, res) => {
  try {
    // if (req.file) {
    //   req.body.image = `/image/${req.file.filename}`;
    // }

    if (req.file) {
      var image = `/${req.file.public_id}.${req.file.format}`;
      var url = req.file.url;
    }
    // const response = await productRepo.editProduct(req.body, req.params);
    const response = await productRepo.editProduct(req.body, req.params, (req.body.image = req.file.url));
    sendResponse.success(res, 201, {
      result: {
        msg: 'Product has ben changed',
        data: response.rows,
        filename: image,
        url,
      },
    });
  } catch (err) {
    sendResponse.error(res, 500, 'Internal Server Error');
  }
};
const drop = async (req, res) => {
  try {
    const result = await productRepo.deleteProduct(req.params);
    sendResponse.success(res, 200, {
      msg: 'Delete Success',
      data: result.rows,
    });
  } catch (obJerr) {
    const statusCode = obJerr.statusCode || 500;
    sendResponse.error(res, statusCode, ' Internal Server Error');
  }
};
const search = async (req, res) => {
  try {
    const hostApi = `${req.protocol}://${req.hostname}:7070`;
    const response = await productRepo.searchProduct(req.query, hostApi);
    res.status(200).json({
      result: response,
    });
  } catch (error) {
    sendResponse.error(res, 500, error.message);
  }
};

const getId = async (req, res) => {
  try {
    const response = await productRepo.getIdProduct(req.params);
    sendResponse.success(res, 202, {
      data: response.rows,
    });
  } catch (err) {
    sendResponse.error(res, 500, 'Internal Server Error');
  }
};

const productControler = {
  create,
  search,
  edit,
  drop,
  getId,
};

module.exports = productControler;
