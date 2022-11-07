const repoUsers = require('../repo/users');
const sendResponse = require('../helper/response');
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
    sendResponse.success(res, 200, {
      msg: 'create succes',
      data: response.rows,
    });
  } catch (err) {
    sendResponse.error(res, 500, err.details);
  }
};
const edit = async (req, res) => {
  try {
    // if (req.file) {
    //   req.body.image = `/image/${req.file.filename}`;
    // }
    let url = req.file.url;
    let image = `/${req.file.public_id}.${req.file.format}`;
    if (req.file) {
      // req.file.filename = `/images/${req.file.filename}`;
      image;
      url;
    }
    // const response = await repoUsers.editUsers(req.body, req.userPayload.user_id);
    // response.rows[0].image = `/images/${req.file.filename}`;
    const response = await repoUsers.editUsers(req.body, req.userPayload.user_id((req.body.image = req.file.url)));
    sendResponse.success(res, 200, {
      msg: 'edit succes',
      data: response.rows,
      filename: image,
      url,
    });
  } catch (err) {
    sendResponse.error(res, 500, 'Internal Server Error');
  }
};
const editPassword = async (req, res) => {
  try {
    const response = await repoUsers.editPassword(req.body, req.userPayload.user_id);
    sendResponse.success(res, 200, {
      msg: (response.text = 'Password has been changed'),
      data: null,
    });
  } catch (obJerr) {
    const statusCode = obJerr.statusCode || 500;
    sendResponse.error(res, statusCode, { msg: obJerr.err.message });
  }
};
const drop = async (req, res) => {
  try {
    const result = await repoUsers.deleteUsers(req.params);
    sendResponse.success(res, 200, {
      msg: 'Delete Success',
      data: result.rows,
    });
  } catch (obJerr) {
    const statusCode = obJerr.statusCode || 500;
    sendResponse.error(res, statusCode, ' Internal Server Error');
  }
};
const UsersControler = {
  get,
  create,
  edit,
  editPassword,
  drop,
};

module.exports = UsersControler;
