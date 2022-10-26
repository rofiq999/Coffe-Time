const authRepo = require('../repo/auth');
const { error, success } = require('../helper/response');
module.exports = {
  login: (req, res) => {
    authRepo
      .login(req.body)
      .then((response) => {
        success(res, 200, {
          data: response,
          msg: 'Login Success',
        });
      })
      .catch((objErr) => {
        const statusCode = objErr.statusCode || 500;
        error(res, statusCode, { msg: objErr.err.message });
      });
  },

  logout: (req, res) => {
    authRepo
      .logout(req.userPayload)
      .then((response) => {
        success(res, 200, {
          data: response,
          msg: 'Logout Success',
        });
      })
      .catch((objErr) => {
        const statusCode = objErr.statusCode || 500;
        error(res, statusCode, { msg: objErr.err.message });
      });
  },
};
