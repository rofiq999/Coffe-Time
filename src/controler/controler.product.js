// const { query } = require('express');
const productRepo = require('../repo/repo.product.js');

//GET data
const get = async (req, res) => {
  try {
    const response = await productRepo.getProduct();
    res.status(200).json({
      result: response.rows,
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Internal server Error',
    });
  }
};

const create = async (req, res) => {
  try {
    const response = await productRepo.createProduct(req.body);
    res.status(201).json({
      result: response,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};

const edit = async (req, res) => {
  try {
    const response = await productRepo.editProduct(req.body, req.params);
    res.status(200).json({ result: response });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};

const drop = async (req, res) => {
  try {
    const result = await productRepo.deleteProduct(req.params);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};
const search = async (req, res) => {
  try {
    const response = await productRepo.searchProduct(req.query);
    res.status(200).json({
      result: response.rows,
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Internal server Error',
    });
  }
};

const sorth = async (req, res) => {
  try {
    const response = await productRepo.shorthProduct(req.query);
    res.status(200).json({
      result: response.rows,
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Internal server Error',
    });
  }
};
const filter = async (req, res) => {
  try {
    const response = await productRepo.filterProduct(req.query);
    res.status(200).json({
      result: response.rows,
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Internal server Error',
    });
  }
};
const productControler = {
  get,
  create,
  edit,
  drop,
  search,
  sorth,
  filter,
};

module.exports = productControler;
