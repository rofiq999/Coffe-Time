const repovoucher = require('../repo/repo.voucher');

//Get
const get = async (req, res) => {
  try {
    const response = await repovoucher.getvoucher();
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
    const response = await repovoucher.createvoucher(req.body);
    res.status(201).json({
      result: response,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};
const edit = async (req, res) => {
  try {
    const response = await repovoucher.editvoucher(req.body, req.params);
    res.status(200).json({ result: response });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};
const drop = async (req, res) => {
  try {
    const result = await repovoucher.deletevoucher(req.params);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};
const search = async (req, res) => {
  try {
    const response = await repovoucher.searchvoucher(req.query);
    res.status(200).json({
      result: response.rows,
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Internal server Error',
    });
  }
};
const voucherControler = {
  get,
  create,
  edit,
  drop,
  search,
};

module.exports = voucherControler;
