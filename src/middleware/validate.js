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
      if (Object.keys(newBody).length === 0) return res.status(400).json({ msg: 'Nothing insert' });
      // apakah setiap value sesuai dengan tipe data yang diinginkan
      if (Object.keys(newBody).length !== allowedKeys.length) return res.status(400).json({ msg: 'input does not match key' });
    };
  },
};
