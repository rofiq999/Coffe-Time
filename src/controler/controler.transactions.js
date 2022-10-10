const repoTransaction = require('../repo/repo.transaction.js');

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
const create = async (req, res) => {
  try {
    const response = await repoTransaction.createTransactions(req.body);
    res.status(201).json({
      result: response,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};
const edit = async (req, res) => {
  try {
    const response = await repoTransaction.editTransactions(req.body, req.params);
    res.status(200).json({ result: response });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};
const drop = async (req, res) => {
  try {
    const result = await repoTransaction.deleteTransactions(req.params);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};
const transactionsControler = {
  get,
  create,
  edit,
  drop,
};

module.exports = transactionsControler;
