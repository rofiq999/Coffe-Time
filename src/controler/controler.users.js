const repoUsers = require('../repo/repo.users');

//Get
const get = async (req, res) => {
  try {
    const response = await repoUsers.getUsers();
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
    const response = await repoUsers.createUsers(req.body);
    res.status(201).json({
      result: response,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};
const edit = async (req, res) => {
  try {
    const response = await repoUsers.editUsers(req.body, req.params);
    res.status(200).json({ result: response });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};
const drop = async (req, res) => {
  try {
    const result = await repoUsers.deleteUsers(req.params);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};
const UsersControler = {
  get,
  create,
  edit,
  drop,
};

module.exports = UsersControler;
