module.exports = {
  body: (...allowedKeys) => {
    return (req, res, next) => {
      const { body } = req;
      const sanitizeKey = Object.keys(body).filter((key) => allowedKeys.includes(key));
      const newBody = {};
      for (let key of sanitizeKey) {
        Object.assign(newBody, { [key]: body[key] });
      }
      req.body = newBody;
      next();
    };
  },
};
