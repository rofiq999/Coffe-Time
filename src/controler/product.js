// const { query } = require('express');
const productRepo = require('../repo/product');
const sendResponse = require('../helper/response');

// GET data

const create = async (req, res) => {
  try {
    const response = await productRepo.createProduct(req.body, (req.file.filename = `/image/${req.file.filename}`));

    // response.rows[0].image = `/images/${req.file.filename}`;
    sendResponse.success(res, 201, {
      result: {
        msg: 'Product created successfully.',
        data: response.rows,
      },
    });
  } catch (err) {
    console.log(err);
    sendResponse.error(res, 500, 'Internal Server Error');
  }
};

const edit = async (req, res) => {
  try {
    if (req.file) {
      req.body.image = `/image/${req.file.filename}`;
    }
    const response = await productRepo.editProduct(req.body, req.params);
    sendResponse.success(res, 201, {
      result: {
        msg: 'Product has ben changed',
        data: response.rows,
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

const productControler = {
  create,
  search,
  edit,
  drop,
};

module.exports = productControler;
