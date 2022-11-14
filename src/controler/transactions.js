const repoTransaction = require('../repo/transaction');
const sendResponse = require('../helper/response');
//Get
const get = async (req, res) => {
  try {
    const response = await repoTransaction.getTransactions();
    res.status(200).json({
      result: response.rows,
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Internal server Error',
    });
  }
};

const history = async (req, res) => {
  try {
    const response = await repoTransaction.historyTransactions(req.query, req.userPayload.user_id);
    // console.log(response);
    sendResponse.success(res, 200, response);
  } catch (err) {
    console.log(err);
    sendResponse.error(res, 500, err.message);
  }
};

const create = async (req, res) => {
  try {
    const response = await repoTransaction.createTransactions(req.bod, req.userPayload.user_id);
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
    const response = await repoTransaction.editTransactions(req.body, req.params);
    sendResponse.success(res, 200, {
      msg: (response.text = 'Transaction has been change'),
    });
  } catch (err) {
    sendResponse.error(res, 500, 'Internal Server Error');
  }
};
const drop = async (req, res) => {
  try {
    const result = await repoTransaction.deleteTransactions(req.params);
    sendResponse.success(res, 200, {
      msg: 'Delete Success',
      data: result.rows,
    });
  } catch (obJerr) {
    const statusCode = obJerr.statusCode || 500;
    sendResponse.error(res, statusCode, ' Internal Server Error');
  }
};
const transactionsControler = {
  get,
  history,
  create,
  edit,
  drop,
};

module.exports = transactionsControler;
