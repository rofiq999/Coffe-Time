const authRouter = require('express').Router();
const authController = require('../controler/auth');
const isLogin = require('../middleware/isLogin');
//login
authRouter.post('/', authController.login);
// logout
// authRouter.delete('/', (req, res) => {});
authRouter.delete('/', isLogin(), authController.logout);

module.exports = authRouter;
