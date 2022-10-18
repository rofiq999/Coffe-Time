const repovoucher = require('../repo/voucher');
const sendResponse = require('../helper/response');
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
    sendResponse.success(res, 200, {
      msg: (response.text = 'Create Succes'),
      data: response.rows,
    });
  } catch (err) {
    sendResponse.error(res, 500, 'Internal Server Error');
  }
};
const edit = async (req, res) => {
  try {
    const response = await repovoucher.editvoucher(req.body, req.params);
    sendResponse.success(res, 200, {
      msg: (response.text = 'Promo has been change'),
    });
  } catch (err) {
    sendResponse.error(res, 500, 'Internal Server Error');
  }
};
const drop = async (req, res) => {
  try {
    const result = await repovoucher.deletevoucher(req.params);
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
