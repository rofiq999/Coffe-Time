// const { query } = require('express');
const productRepo = require('../repo/product');
const sendResponse = require('../helper/response');

// GET data

const create = async (req, res) => {
  try {
    const response = await productRepo.createProduct(req.body, req.file.path);
    response.rows[0].image = `/images/${req.file.filename}`;
    sendResponse.success(res, 200, {
      msg: (response.text = 'Create Succes'),
      data: response.rows,
    });
  } catch (err) {
    console.log(err);
    sendResponse.error(res, 500, 'Internal Server Error');
  }
};

const edit = async (req, res) => {
  try {
    if (req.file) {
      // req.body.image = req.file;
      req.body.image = req.file.path;
    }
    const response = await productRepo.editProduct(req.body, req.params);
    response.rows[0].image = `/images/${req.file.filename}`;
    sendResponse.success(res, 200, {
      msg: 'Product has been change',
      data: response.rows,
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

const productControler = {
  create,
  search,
  edit,
  drop,
};

module.exports = productControler;
